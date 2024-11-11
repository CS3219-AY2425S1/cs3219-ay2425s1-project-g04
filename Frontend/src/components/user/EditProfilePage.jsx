import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar';
import ProfileSidebar from './ProfileSidebar';
import EditProfile from './EditProfile';
import { getUserFromToken } from "./utils/authUtils";

function EditProfilePage() {
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUserFromToken();
                if (user) {
                    setUserID(user.userId); // asynchronous
                    console.log(`I have gotten the user id in edit profile page: ${user.userId}`)
                }
            } catch (error) {
                console.error('Error fetching user ID in edit profile page component:', error);
            }
        }
        fetchData();
    }, []);
    


    return(
        <div>
            <NavigationBar/>
            <div className="row">
                <div className="Navbar col-2">
                    <ProfileSidebar userID={userID}/>
                </div>
                <div className="col-10">
                    <EditProfile/>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;