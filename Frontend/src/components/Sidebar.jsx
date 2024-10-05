import React, { useState, useEffect } from 'react';
import matchmakingService from '../services/matchmaking';
import { Button, Stack, Form, Spinner, Alert } from 'react-bootstrap';

function Sidebar() {
    const [userId, setUserId] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [language, setLanguage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeoutError, setTimeoutError] = useState(false);

    const handleMatchClick = async () => {
        setIsLoading(true);
        setTimeoutError(false);

        try {
            const result = await matchmakingService.matchUser(userId, difficulty, language);
            console.log(result);

            // Set a 30-second timeout to check if a match has been found
            const timeoutId = setTimeout(() => {
                setIsLoading(false);
                setTimeoutError(true); // Trigger the timeout notification
                alert('No match found within 30 seconds. You have been removed from the queue.');
            }, 30000);

            // In a real-world scenario, you would check the status here.
            // If a match is found before the timeout, clear the timeout.
            result.on('matchFound', () => {
                clearTimeout(timeoutId);
                setIsLoading(false);
                alert('Match found!');
            });
        } catch (error) {
            setIsLoading(false);
            alert('Error adding to matchmaking queue');
        }
    };

    return (
        <Stack gap={3} className='p-3 m-3 justify-content-center align-items-center'>
            <Form.Control
                type="text"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
            />
            <div>
                <Button 
                    variant={difficulty === 'easy' ? "success" : "outline-success"}
                    onClick={() => setDifficulty('easy')}
                >
                    Easy
                </Button>{' '}
                <Button 
                    variant={difficulty === 'medium' ? "warning" : "outline-warning"}
                    onClick={() => setDifficulty('medium')}
                >
                    Medium
                </Button>{' '}
                <Button 
                    variant={difficulty === 'hard' ? "danger" : "outline-danger"}
                    onClick={() => setDifficulty('hard')}
                >
                    Hard
                </Button>{' '}
            </div>
            <Form.Select onChange={(e) => setLanguage(e.target.value)} aria-label="Select your language">
                <option>Select your language</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
            </Form.Select>
            <Button variant="primary" onClick={handleMatchClick} disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Match me!'}
            </Button>

            {timeoutError && <Alert variant="danger">No match found within 30 seconds. Please try again later.</Alert>}
        </Stack>
    );
}

export default Sidebar;
