import React, { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';
import userService from '../../services/users';

const Loading = () => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            </div>
            <p className="mt-3">Loading, please wait...</p>
        </div>
    )
}

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('jwt_token');
        const authHeader = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        // verify token asynchronously, set auth status only after request completes
        userService.verifyToken(authHeader)
        .then(response => {
            console.log(response);
            setIsAuthenticated(true);
        })
        .catch(e => {
            console.log('Error:', e);
            setIsAuthenticated(false);
        });
    }, []);

    // To wait for isAuth to generate, render loading spinner 
    if (isAuthenticated == null) {
        return <Loading/>; 
    }

    return isAuthenticated ? children : <Navigate to="/login"/>
}

export default ProtectedRoute;
