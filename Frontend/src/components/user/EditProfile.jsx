// Page where users can change their profile information, including their username, email, and password.
import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import userService from "../../services/users"
import InputField from "../auth/InputField";

function EditProfile() {
    const navigate = useNavigate();
    const { id } = useParams(); // Access the id from the route
    const [userData, setUserData] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    useEffect(() => {
        // Fetch the user data based on the id
        async function fetchUserData() {
            const response = await userService.getUser(id,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}` } });
            setUserData(response.data);
            setEmail(response.data.data.email)
        }
        fetchUserData();
    }, [id]);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword ] = useState('')
    const handleEditProfile = async (e) => {
        e.preventDefault();
        // Handle the user profile edit
        const newUser = {};
        if (username) newUser.username = username;
        if (password) newUser.password = password;

        // Reset error messages
        setErrorMessage('');
        setSuccessMessage('');
        setUsernameError(false);
        setPasswordError(false);

        // Validate inputs
        if (!username && !password) {
            setErrorMessage("Please fill in at least one field")
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9._]{3,20}$/;
        const isValidUsername = usernameRegex.test(username)
        
        if(!isValidUsername && username !== "") {
            console.log("username is not valid:", username)
            setUsernameError(true)
            setErrorMessage("Username can only contain letters, numbers, dots (.), and underscores (_), and must be between 3 and 20 characters long.")
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError(true);
            setErrorMessage('Passwords do not match');
            return;
        }

        // update user data
        try {
            await userService.updateUser(id, newUser,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}` } });
            setSuccessMessage('User data updated successfully!');
            navigate("/home")
        } catch (e) {
            console.log("Unable to update user data", e);
            if (e.response) {
                switch (e.response.status) {
                    case 401:
                        setErrorMessage('Unauthorized. Please login again.');
                        break;
                    case 409:
                        setErrorMessage('Username or email already exists.');
                        setUsernameError(true);
                        // setEmailError(true);
                        break;
                    case 500:
                        setErrorMessage('Server error. Please try again later.');
                        break;
                    default:
                        setErrorMessage('An unexpected error occurred.');
                        break;
                }
            }
        }
    }


    const goHome = () => navigate('/home')
    // Render user edit form based on userData
    return userData ? (
        
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'left',
            height: '100vh',
            textAlign: 'center', // Centers text within child elements
            margin: 30 // Ensures no default margin
        }}>
            <div style={{
                width: '100%', // Full width
                maxWidth: '600px', // Optional: limit width for better layout
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '8px' // Optional: rounded corners
            }}>
                <h2 style={{textAlign: 'left'}}>Edit Profile</h2>
                <p style={{ textAlign: 'left'}}>Hi <strong>{email}</strong>, feel free to update any information below.</p>
                <div className="input-container">
                    <form onSubmit={handleEditProfile}>
                        <InputField
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setUsernameError(false);
                            }}
                            error={usernameError}
                        />
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError(false);
                            }}
                            error={passwordError}
                        />
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setPasswordError(false);
                            }}
                            error={passwordError}
                        />
                        <div className='button-container' style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button type='button' onClick={goHome} className="create-account-link">
                                Cancel
                            </button>
                            <button type="submit" className="signup-button">
                                Change Profile Details
                            </button>
                        </div>

                    </form>
                    <div className='notification' style={{ marginTop: '5px', textAlign: 'center' }}>
                        {successMessage && <p className="text-success mt-3">{successMessage}</p>}
                        {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <p>Loading...</p>
    );
}

export default EditProfile;
