// utils/authUtils.js
import {jwtDecode} from "jwt-decode";
import userService from "../../../services/users";

export async function getUserFromToken() {
    const jwtToken = sessionStorage.getItem('jwt_token');
    if (jwtToken) {
        try {
            const decodedToken = jwtDecode(jwtToken);
            const userId = decodedToken.id;

            const userResponse = await userService.getUser(userId, {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });
            
            // Assuming the user data is nested as described
            const username = userResponse.data.data.username
            return { userId: userId, username: username };
        } catch (error) {
            console.error("Error fetching user:", error);
            return null; // Return null to indicate no user data could be retrieved
        }
    }
    return null;
}
