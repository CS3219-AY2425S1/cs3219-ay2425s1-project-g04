const { publishToQueue , publishCancelRequest} = require('../rabbitmq/publisher');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('User connected to WebSocket');

    // Listen for messages from the frontend
    ws.on('message', async (message) => {
        try {
            console.log(`Received message: ${message}`);

            // Parse the message to extract userId, difficulty, and language
            const { userId, difficulty, language , action} = JSON.parse(message);

            // Store userId in WebSocket connection
            ws.userId = userId;

            if (action === 'match') {
                // Call the RabbitMQ publisher to publish this message to the queue
                await publishToQueue({ userId, difficulty, language });
                console.log('Message published to RabbitMQ');
                
                // Notify the user that their message has been processed successfully
                ws.send(JSON.stringify({ status: 'su9ccess', message: 'Match request sent!' }));
            } else if (action === 'cancel') {
                await publishCancelRequest({ userId });
                console.log('Cancel request published to RabbitMQ');
                
                // Notify the user that their cancel request has been processed successfully
                ws.send(JSON.stringify({ status: 'success', message: 'Match request cancelled!' }));
            }
            
            
            
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
            ws.send(JSON.stringify({ status: 'error', message: 'Match request failed!' }));
        }
    });

    ws.on('close', () => {
        console.log('User disconnected from WebSocket');
    });
});


/**
 * Notify users through WebSocket.
 * @param {string|array} userId - User ID or an array of user IDs to notify.
 * @param {string} message - The message to send.
 * @param {string} type - The type of message (e.g., 'match' or 'rejection').
 */
function notifyUsers(userId, message, type) {
    console.log(`Notifying user(s): ${userId}, Message: ${message}, Type: ${type}`);

    const userIds = Array.isArray(userId) ? userId : [userId]; // Convert to array if single user

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && userIds.includes(client.userId)) {
            console.log(`Notifying client: ${client.userId}`);
            client.send(JSON.stringify({
                userId: client.userId, 
                message,
                type
            }));
        }
    });
}

module.exports = { notifyUsers };
