import React, { useState } from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';

function UnsuccessfulMatch({ handleClose, handleMatch}) {
    return (
        <div className="matching-container">
            <div className="close-button" onClick={handleClose}>✖</div>
            <div className="matching-text">
            <CloseButton className="close-button" onClick={handleClose}></CloseButton>
                <h2>Sorry, we are unable to find you a match.</h2>
                <button className='btn btn-primary btn-sm' onClick={handleMatch}>Match me again</button>
            </div>
        </div>
    );
}

export default UnsuccessfulMatch;
