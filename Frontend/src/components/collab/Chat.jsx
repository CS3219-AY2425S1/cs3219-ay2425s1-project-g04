import React, {useState, useRef, useEffect} from 'react';
import {Accordion, ListGroup, ListGroupItem, Form, Button, Badge} from 'react-bootstrap';

const Chat = ({ currentUser, messages, sendMessage }) => {
    const [text, setText] = useState('');
    const chatContainerRef = useRef(null);
    const [isAccordionOpen, setIsAccordionOpen] = useState(true);

    const handleSend = () => {
        console.log("I am sending")
        if (text.trim()) {
            sendMessage(text);
            setText('');
        }
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Accordion defaultActiveKey="0" className='mt-3' onSelect={(eventKey) => setIsAccordionOpen(eventKey === "0")} style={{ height: '100%' }}>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    Chat
                </Accordion.Header>
                <Accordion.Body style={{ display: 'flex', flexDirection: 'column'}}>
                    <div
                        ref={chatContainerRef}
                        style={{
                            minHeight: '33vh',
                            maxHeight: '33vh',
                            flex: 1,
                            overflowY: 'auto',
                            marginBottom: '1rem',
                        }}
                    >
                        <ListGroup>
                            {messages.map((msg, idx) => (
                                <>
                                    <ListGroupItem
                                        key={idx}
                                        style={{
                                            backgroundColor: msg.sender === currentUser ? "#d1e7dd" : "#50d7da",
                                            textAlign: msg.sender === currentUser ? "right" : "left"
                                        }}
                                    >
                                        {/* alternative: keep badge within same line*/}
                                        {/*{msg.sender !== currentUser && <><Badge bg="secondary">{msg.sender}</Badge> {msg.text}</>}*/}
                                        {/*{msg.sender === currentUser && <>{msg.text} <Badge bg="secondary">{msg.sender}</Badge></>}*/}

                                        {msg.text}
                                    </ListGroupItem>
                                    <ListGroupItem
                                        key={idx}
                                        style={{
                                            backgroundColor: "white",
                                            textAlign: msg.sender === currentUser ? "right" : "left",
                                            border: "none",
                                            padding: "0",
                                    }}>
                                        <Badge bg="secondary">{msg.sender}</Badge>
                                    </ListGroupItem>
                                    {/* spacer */}
                                    <div style={{ height: '10px' }}></div>
                                </>
                            ))}
                        </ListGroup>
                    </div>
                    {isAccordionOpen && ( // Only show message input when accordion is open
                        <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', alignItems: 'center' }}>
                            <Form.Group controlId="messageInput" style={{ flex: 1, marginRight: '10px' }}> {/* Makes input take available space */}
                                <Form.Control
                                    type="text"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Send
                            </Button>
                        </Form>
                    
                    )}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default Chat;