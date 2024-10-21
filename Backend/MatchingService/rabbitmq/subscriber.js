const amqp = require('amqplib');
const { queueNames } = require('./setup.js');
// const { matchUsers } = require('../services/matchingService.js');
const { notifyUsers } = require('../websocket/websocket');
const { v4: uuidv4 } = require('uuid');

// TODO: Subscribe and acknowledge messages with user info when timeout/user matched

// To remember what goes in a subscriber use some Acronym
// Connect, Assert, Process, E - for Acknowledge

const dead_letter_queue_name = "dead_letter_queue";
const timeoutMap = {};

// Local dictionary to store waiting users
const waitingUsers = {};

// using promises to handle errors and ensure clearing of timer.
function matchUsers(channel, msg, userId, language, difficulty) {
    const criteriaKey = `${difficulty}.${language}`;

    // If the criteria key does not exist, create it
    if (!waitingUsers[criteriaKey]) {
        waitingUsers[criteriaKey] = [];
    }

    // Store both the userId, message, and the channel in waitingUsers
    waitingUsers[criteriaKey].push({ userId, msg, channel });
    console.log(`User ${userId} added to ${criteriaKey}. Waiting list: ${waitingUsers[criteriaKey].length}`);

    // Check if there are 2 or more users waiting for this criteria
    if (waitingUsers[criteriaKey].length >= 2) {
        const matchedUsers = waitingUsers[criteriaKey].splice(0, 2); // Match the first two users
        console.log(`Matched users: ${matchedUsers.map(user => user.userId)}`);
        
        // Create a unique collaboration room ID
        const roomId = uuidv4();

        // Notify users of the match
        notifyUsers(matchedUsers.map(user => user.userId), 'Match found!', 'match', {
                collaborationUrl: `/collaboration/${roomId}`
            });

        // Acknowledge the messages for both matched users
        matchedUsers.forEach(({ msg, channel }) => {
            acknowledgeMessage(channel, msg);
        });

        return true;
    }

    return false;
}


async function acknowledgeMessage(channel, msg) {
    return new Promise((resolve, reject) => {
        try {
            channel.ack(msg);
            console.log(`Acknowledged message for user: ${JSON.parse(msg.content).userId}`);
            clearTimeout(timeoutMap[JSON.parse(msg.content).userId]); // Clear any pending timeout
            delete timeoutMap[JSON.parse(msg.content).userId]; // Clean up
            resolve();
        } catch (error) {
            console.error(`Failed to acknowledge message:`, error);
            reject(error);
        }
    });
}

async function rejectMessage(channel, msg, userId) {
    return new Promise((resolve, reject) => {
        try {
            // Get user data from the message to find the correct key in waitingUsers
            const userData = JSON.parse(msg.content.toString());
            const { language, difficulty } = userData;

            // Correctly creating the criteriaKey using template literals
            const criteriaKey = `${difficulty}.${language}`;

            
            // Find the user in the waitingUsers list and remove them
            if (waitingUsers[criteriaKey]) {
                // Find the index of the user in the waiting list
                const userIndex = waitingUsers[criteriaKey].findIndex(user => user.userId === userId);

                if (userIndex !== -1) {
                    // Remove the user from the waiting list
                    waitingUsers[criteriaKey].splice(userIndex, 1);
                    console.log(`Removed user ${userId} from waiting list for ${criteriaKey}`);
                }
            }

            // Reject the message without requeuing
            channel.reject(msg, false); // Reject without requeuing
            console.log(`Rejected message for user: ${userId}`);

            // Clean up the timeoutMap
            if (timeoutMap[userId]) {
                clearTimeout(timeoutMap[userId]);
                delete timeoutMap[userId];
            }

            resolve();
        } catch (error) {
            console.error(`Failed to reject message for user ${userId}:, error`);
            reject(error);
        }
    });
}

async function consumeQueue() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        console.log("Waiting for users...");

        // Process + subscribe to each matchmaking queue
        for (let queueName of queueNames) {
            await channel.consume(queueName, async (msg) => {
                if (msg !== null) {
                    const userData = JSON.parse(msg.content.toString());
                    const { userId, language, difficulty } = userData;

                    // Perform the matching logic
                    console.log(`Received user ${userId} with ${language} and ${difficulty}`);
                    
                    // Call matchUsers with channel, message, and user details
                    const matched = matchUsers(channel, msg, userId, language, difficulty);

                    if (!matched) {
                        console.log(`No match for ${userId}, waiting for rejection timeout.`);

                        const timeoutId = setTimeout(async () => {
                            await rejectMessage(channel, msg, userId);
                        }, 10000); // 10 seconds delay

                        timeoutMap[userId] = timeoutId;
                    }
                }
            }, { noAck: false }); // Ensure manual acknowledgment
        }

        console.log("Listening to matchmaking queues");

        await consumeCancelQueue();
        console.log("Listening to Cancel Queue");
    } catch (error) {
        console.error('Error consuming RabbitMQ queue:', error);
    }
}

async function consumeDLQ() {
  try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();

      // Consume messages from the DLQ
      await channel.consume(dead_letter_queue_name, (msg) => {
          if (msg !== null) {
              const messageContent = JSON.parse(msg.content.toString());
              const { userId, difficulty, language } = messageContent;

              console.log(`Received message from DLQ for user: ${userId}`);

              // Notify the user via WebSocket
              notifyUsers(userId, `Match not found for ${difficulty} ${language}, please try again.`, 'rejection');

              // Acknowledge the message (so it's removed from the DLQ)
              channel.ack(msg);
          }
      });

      console.log(`Listening to Dead Letter Queue for unmatched users...`);
  } catch (error) {
      console.error('Error consuming from DLQ:', error);
  }
}

async function consumeCancelQueue() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Subscribe to the cancel queue
        await channel.consume('cancel_queue', async (msg) => {
            if (msg !== null) {
                const { userId } = JSON.parse(msg.content.toString());
                console.log(`Received cancel request for user: ${userId}`);

                // Process the cancel request
                await cancelMatching(channel, msg, userId);
            }
        }, { noAck: false }); // Ensure manual acknowledgment

        console.log("Listening for cancel requests");
    } catch (error) {
        console.error('Error consuming cancel queue:', error);
    }
}

async function cancelMatching(cancelChannel, cancelMsg, userId) {
    try {
        let foundOriginalMsg = false;

        // Loop through waitingUsers to find the original message for the user
        Object.keys(waitingUsers).forEach(criteriaKey => {
            const userIndex = waitingUsers[criteriaKey].findIndex(user => user.userId === userId);

            if (userIndex !== -1) {
                const { msg, channel } = waitingUsers[criteriaKey][userIndex]; // Get original msg and its channel

                // Acknowledge the original matchmaking message from the queue (e.g., easy.python)
                if (msg && channel) {
                    console.log(`Acknowledging original message for user ${userId} in queue ${criteriaKey}`);
                    channel.ack(msg); // Use the same channel that consumed the message to acknowledge it
                    foundOriginalMsg = true;
                }

                // Remove the user from the waiting list
                waitingUsers[criteriaKey].splice(userIndex, 1);
                console.log(`User ${userId} removed from waiting list for ${criteriaKey}`);
            }
        });

        // If original message not found, log a warning
        if (!foundOriginalMsg) {
            console.warn(`Original message for user ${userId} not found in matchmaking queues.`);
        }

        // Clear any timeouts for the user
        if (timeoutMap[userId]) {
            clearTimeout(timeoutMap[userId]);
            delete timeoutMap[userId];
        }

        // Acknowledge the cancel message from the cancel queue
        cancelChannel.ack(cancelMsg);
        console.log(`Cancel processed for user ${userId}`);

    } catch (error) {
        console.error(`Failed to process cancel for user ${userId}:`, error);
    }
}


module.exports = { consumeQueue, consumeDLQ };