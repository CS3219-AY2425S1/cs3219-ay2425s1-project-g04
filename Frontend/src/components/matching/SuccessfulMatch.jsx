import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';

function SuccessfulMatch({ handleClose }) {
    return (
        <div className="matching-container">
            <div className="matching-text">
                <h2>We found you a match!</h2>
                <p>Redirecting you to collab space...</p>
            </div>
        </div>
    );
}

export default SuccessfulMatch;
