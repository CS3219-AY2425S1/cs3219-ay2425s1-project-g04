import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar';
import HistoryTable from './HistoryTable';
import ProfileSidebar from './ProfileSidebar';
import { getUserFromToken } from "./utils/authUtils";



function HistoryPage() {
    const [userID, setUserID] = useState(null);
    const [username, setUsername] = useState(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUserFromToken();
                if (user) {
                    setUserID(user.userId); // asynchronous
                    setUsername(user.username); // asynchronous
                    console.log(`I have gotten the user id in history page: ${user.userId} ${user.username}`)

                }
            } catch (error) {
                console.error('Error fetching user ID in history page component:', error);
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
                    <HistoryTable userID={userID}/>
                </div>
            </div>
        </div>
    );
}

export default HistoryPage;