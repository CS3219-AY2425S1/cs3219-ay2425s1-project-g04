import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getUserFromToken } from '../user/userAvatarBox';
import QuestionDisplay from './QuestionDisplay';
import Chat from './Chat';
import CollabNavigationBar from './CollabNavigationBar';
import CodeSpace from './CodeSpace';
import { Container, Row, Col } from 'react-bootstrap';
import collabService from '../../services/collab'; 
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';

const CollaborationSpace = () => {
    const navigate = useNavigate();
    const { roomId } = useParams(); // Get the roomId from the URL
    const [yDoc, setYDoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [websocket, setWebsocket] = useState(null); // add websocket state to be access by other functions
    const [code, setCode] = useState('');
    const [users, setUsers] = useState([]); // track users in the room 
    const [userId, setUserId] = useState(""); // current user 
    const [language, setLanguage] = useState("python") // set default language to python 
    const [output, setOutput] = useState("")

    const LANGUAGEVERSIONS = {
        "python" : "3.10.0",
        "java" : "15.0.2",
        "c++": "10.2.0"
    };

    const [showAccessDeniedToast, setShowAccessDeniedToast] = useState(
        JSON.parse(sessionStorage.getItem('showAccessDeniedToast')) || false
    );
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(
        JSON.parse(sessionStorage.getItem('loading')) !== false
    );

    const handleCloseToast = () => {
        setShowAccessDeniedToast(false);
        sessionStorage.setItem('showAccessDeniedToast', false);
        navigate("/home");
    };

    // Set up websockets for room management on client side, and collaboration for Yjs
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUserFromToken();
            if (user !== "No User") {
                setUserId(user.username); // Set the username in state
                initiateWebSocket(user.username);
            } else {
                setUserId("Guest"); // Fallback in case no user is found
            }
        };

        fetchUser();
        // Sync states with sessionStorage
        return () => {
            sessionStorage.setItem('loading', loading);
            sessionStorage.setItem('showAccessDeniedToast', showAccessDeniedToast);
        };
    }, [loading, showAccessDeniedToast]);

    const initiateWebSocket = (userId) => {
        const websocket = new WebSocket("ws://localhost:3004");
        setWebsocket(websocket);

        websocket.onopen = () => {
            websocket.send(JSON.stringify( {type: 'joinRoom', roomId, userId: userId}));
            
            // Request userIds when matched user rejoins
            websocket.send(JSON.stringify({ type: 'requestUserList', roomId }));
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const stringData = JSON.stringify(data);
            console.log(`[FRONTEND] data message is ${stringData}`);
            switch (data.type) {
                case 'usersListUpdate':
                    setUsers(data.users);  // Update the user list
                    setShowAccessDeniedToast(false);
                    setLoading(false);      // Access allowed; stop loading
                    sessionStorage.setItem('loading', false);
                    break;
                case 'accessDenied':
                    setToastMessage(data.message);
                    setShowAccessDeniedToast(true);
                    setLoading(false);
                    sessionStorage.setItem('showAccessDeniedToast', true);
                    break;
                default:
                    console.log("No messages received from room management server");
                    break;
            }
        };

        // create a Yjs document for collaboration
        const doc = new Y.Doc();
        setYDoc(doc);

        // create websocket provider to synchronize the document
        const wsProvider = new WebsocketProvider("ws://localhost:1234", roomId, doc);
        setProvider(wsProvider);

        // Create a shared type in Yjs for collaborative code editing
        const yText = doc.getText('monacoEditor');

        // Update monaco editor with Yjs changes 
        yText.observe(() => {
            setCode(yText.toString());
        });

        return () => {
            // clean up for room management
            wsProvider.destroy();
            doc.destroy();
        };
    };

    const handleExit = () => {
        websocket.send(JSON.stringify({ type: 'leaveRoom', roomId, userId}));
        if (provider) provider.destroy();
        if (yDoc) yDoc.destroy();
        navigate("/home");
    };

    const handleCodeRun = () => {
        const code_message = {
            "language": language,
            "files": [{ "content": code }],
            "version": LANGUAGEVERSIONS[language]
        };

        collabService.getCodeOutput(code_message)
        .then(result => setOutput(result.data.run.output))
        .catch(err => console.log(err));
    };

    const handleEditorChange = (value) => {
        const yText = yDoc.getText('monacoEditor');
        yText.delete(0, yText.length);
        yText.insert(0, value);
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <Spinner animation="border" variant="primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p>Loading collaboration space...</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center' }}>
            {showAccessDeniedToast ? (
            <ToastContainer
                className="p-3"
                position="top-center"
                style={{ zIndex: 1 }}
            >
                <Toast 
                    onClose={handleCloseToast} 
                    show={showAccessDeniedToast} 
                    delay={3000} 
                    autohide
                    bg="danger"
                >
                    <Toast.Body className='text-white'>
                        <strong>{toastMessage}</strong>
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        ) : (
            <>
                <div>
                    <CollabNavigationBar handleExit={handleExit} handleCodeRun={handleCodeRun} users={users} setLanguage={setLanguage} language={language}/>
                    <Container fluid style={{ marginTop: '20px' }}>
                        <Row>
                            <Col md={8}>
                                <CodeSpace handleEditorChange={handleEditorChange} code={code} language={language} output={output}/>
                            </Col>
                            <Col md={4}>
                                <QuestionDisplay/>
                                <Chat/>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </>
        )}
        </div>
    );
};

export default CollaborationSpace;