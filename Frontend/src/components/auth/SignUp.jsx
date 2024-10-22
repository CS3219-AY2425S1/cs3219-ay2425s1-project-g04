import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import userService from '../../services/users';
import InputField from './InputField'; // Import the InputField component
import '../../css/SignUp.css'; // Import the CSS for styling

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const newUser = {
            username,
            email,
            password
        };

        try {
            const response = await userService.createUser(newUser);
            if (response.status === 201) {
                setSuccessMessage('User created successfully!');
                setUsername('');
                setEmail('');
                setPassword('');
                // Redirect to the login page
                setTimeout(() => {
                    navigate('/login'); // Redirect to login after a short delay
                }, 2000); // Delay for 2 seconds to show success message
            }
        } catch (error) { 
            // Check the error response status code and set appropriate error messages
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setErrorMessage('Please fill in all required fields.');
                        setUsernameError(true);
                        setEmailError(true);
                        setPasswordError(true);
                        break;
                    case 409:
                        setErrorMessage('Username or email already exists.');
                        setUsernameError(true);
                        setEmailError(true);
                        break;
                    case 500:
                        setErrorMessage('Server error. Please try again later.');
                        break;
                    default:
                        setErrorMessage('An unexpected error occurred.');
                        break;
                }
            } else {
                setErrorMessage('Network error. Please check your connection.');
            }
        }
    };

    return (
      <div className="signup-container">
        <div className="left-side">
          <h1 className="title">PeerPrep</h1>
          <h2 className="subtitle">Create an Account</h2>
        </div>
        <div className="right-side">
          <div className="input-container">
            <form onSubmit={handleSignUp}>
                <InputField 
                    label="Username" 
                    type="text" 
                    placeholder="Enter your username" 
                    value={username} 
                    onChange={(e) => {
                        setUsername(e.target.value)
                        setUsernameError(false);
                    }}
                    error={usernameError} 
                    required 
                />
                <InputField 
                    label="Email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError(false);
                    }}
                    error={emailError} 
                    required 
                />
                <InputField 
                    label="Password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => { 
                        setPassword(e.target.value)
                        setPasswordError(false);
                    }}
                    error={passwordError} 
                    required 
                />
                <div className='button-container'>
                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>
                </div>
            </form>
            <div className='notification'>
              {/* Success Message */}
              {successMessage && <p className="text-success mt-3">{successMessage}</p>}

              {/* Error Message */}
              {errorMessage && <p className="text-danger mt-3">{errorMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    );
}

export default SignUp;
