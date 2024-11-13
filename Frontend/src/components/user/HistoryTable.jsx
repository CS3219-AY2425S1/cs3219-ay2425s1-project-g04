// AttemptHistory.js
import React, { useState, useEffect } from 'react';
import HistoryAttempt from './HistoryAttempt';
import historyService from "../../services/history";


const HistoryTable = ({userID}) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                if (userID) {
                    const result = await historyService.getHistoryByUserId(userID);
                    setHistory(result.data);
                    console.log(`I have gotten the user id in table: ${userID}`)
                }
            } catch (error) {
                console.error('Error fetching attempt history:', error);
            }
        }
        fetchData();
    }, [userID]);

    return (
        <div className="history-table">
            <h2>Attempt History</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Matched User</th>
                        <th>Question</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((attempt, index) => (
                        <HistoryAttempt key={index} attempt={attempt} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
