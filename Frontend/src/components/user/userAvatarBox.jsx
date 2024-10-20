import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, ButtonGroup } from "react-bootstrap";
import {jwtDecode} from "jwt-decode";
import userService from "../../services/users";


export async function getUserFromToken() {
    const jwtToken = sessionStorage.getItem('jwt_token');
    if (jwtToken) {
        const decodedToken = jwtDecode(jwtToken);
        try {
            // decodedToken has an id field in auth-controller.js
            // user fetched by id has a username field in user-model.js
            const id = decodedToken.id;
            const user = await userService.getUser(
                decodedToken.id, {headers: {Authorization: `Bearer ${jwtToken}`}})
            // getUser return an Object with data, message, and type
            // The user data is nested in Object.data and hence we need a double .data to access it
            return {id: id, username: user.data.data.username};
        } catch (error) {
            console.error(error);
            return "No User";
        }
    }
    return "No User";
}

function UserAvatarBox() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("No User");

    const handleLogout = () => {
        sessionStorage.removeItem('jwt_token');
        navigate('/login');
    };

    useEffect(() => {
        async function fetchData() {
            const user = await getUserFromToken();
            console.log("User: ", user);
            if (user) {
                setUser(user)
                setUsername(user.username);
                console.log(user.username);
            }
        }
        fetchData();
    }, []);

    return (
    <Dropdown as={ButtonGroup} className="ms-auto">
        {/* Nice to have image in the future*/}
        <Dropdown.Toggle id="dropdown-custom-1">
            {username}
        </Dropdown.Toggle>
        <Dropdown.Menu className="super-colors">
            <Dropdown.Item eventKey="1" onClick={handleLogout}>
                <span style={{color: 'red'}}>Logout</span>
            </Dropdown.Item>
            <Dropdown.Item eventKey="2" onClick={() => navigate(`/profile/${user.id}`)}>Edit Profile</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
    );
}

export default UserAvatarBox;