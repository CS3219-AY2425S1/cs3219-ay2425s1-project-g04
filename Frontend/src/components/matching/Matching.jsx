import React, { useState, useEffect } from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import '../../css/Matching.css'; 

function Matching({ handleCancel }) {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds === 59) {
                    setMinutes((prevMinutes) => prevMinutes + 1);
                    return 0;
                } else {
                    return prevSeconds + 1;
                }
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on unmount
    }, []);

    return (
        <div className="matching-container">
            <div className="matching-text">
                <h2>Matching you....</h2>
                <p>{`${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</p>
                <button className='btn btn-primary btn-sm' style={{display: 'none'}} onClick={handleCancel} >Cancel</button>
            </div>
        </div>
    );
}

export default Matching;
