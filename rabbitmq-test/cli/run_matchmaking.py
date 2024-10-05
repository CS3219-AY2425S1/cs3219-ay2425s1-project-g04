import subprocess
import time

def run_subscriber():
    # Start the subscriber.js script and capture its output
    return subprocess.Popen(['node', 'subscriber.js'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

def run_publisher(user_id, difficulty, language):
    # Run the publisher.js script with user ID, difficulty, and language as arguments, capturing its output
    return subprocess.Popen(['node', 'publisher.js', user_id, difficulty, language], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

def print_process_output(process):
    # Read and print stdout and stderr of the process
    stdout, stderr = process.communicate()
    if stdout:
        print(f"Output:\n{stdout}")
    if stderr:
        print(f"Errors:\n{stderr}")

def simulate_successful_match():
    print("Simulating a successful match...")

    # Start the subscriber process (listener)
    subscriber_process = run_subscriber()

    # Add two users with the same difficulty and language (to ensure a match)
    time.sleep(2)  # Allow time for the subscriber to start
    publisher1 = run_publisher('user_001', 'easy', 'python')
    time.sleep(1)  # Slight delay between publishing users
    publisher2 = run_publisher('user_002', 'easy', 'python')

    # Wait for the publisher processes to complete
    print_process_output(publisher1)
    print_process_output(publisher2)

    # Allow time for matchmaking process to complete
    time.sleep(5)

    # Terminate the subscriber process and print its output
    subscriber_process.terminate()
    print_process_output(subscriber_process)

def simulate_timeout():
    print("Simulating a timeout...")

    # Start the subscriber process (listener)
    subscriber_process = run_subscriber()

    # Add two users with different difficulty and language (no match possible)
    time.sleep(2)  # Allow time for the subscriber to start
    publisher1 = run_publisher('user_003', 'medium', 'javascript')
    time.sleep(1)  # Slight delay between publishing users
    publisher2 = run_publisher('user_004', 'hard', 'go')

    # Wait for the publisher processes to complete
    print_process_output(publisher1)
    print_process_output(publisher2)

    # Wait for more than 60 seconds to allow the timeout
    time.sleep(65)

    # Terminate the subscriber process and print its output
    subscriber_process.terminate()
    print_process_output(subscriber_process)

if __name__ == "__main__":
    # Run the successful match simulation
    simulate_successful_match()
    
    # Simulate the timeout after a brief pause
    time.sleep(5)
    simulate_timeout()
