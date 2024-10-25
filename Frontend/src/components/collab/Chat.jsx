import React, { useState } from 'react';
import { Accordion, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';

const Chat = ({ currentUser, messages, sendMessage }) => {
    const [text, setText] = useState('');

    const handleSend = () => {
        console.log("I am sending")
        if (text.trim()) {
            sendMessage(text);
            setText('');
        }
    };

    return (
        <Accordion defaultActiveKey="0" className='mt-3'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        Chat
                    </Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {messages.map((msg, idx) => (
                                <ListGroupItem
                                    key={idx}
                                    style={{
                                        backgroundColor: msg.sender === currentUser ? "#d1e7dd" : "#50d7da",
                                        textAlign: msg.sender === currentUser ? "right" : "left"
                                    }}
                                >
                                    {msg.text}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                        <Form className="mt-3" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                            <Form.Group controlId="messageInput">
                                <Form.Control
                                    type="text"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-2">
                                Send
                            </Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
        </Accordion>
    );
};

export default Chat;