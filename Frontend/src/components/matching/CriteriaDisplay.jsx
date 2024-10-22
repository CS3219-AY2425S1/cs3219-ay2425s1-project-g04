import React from 'react';
import { Card, Badge } from 'react-bootstrap';

const getBadgeVariant = (difficulty) => {
    switch (difficulty) {
        case 'easy':
            return 'success';
        case 'medium':
            return 'warning';
        case 'hard':
            return 'danger';
        default:
            return 'secondary'; // in case no difficulty chosen 
    }
}

const capitalizeFirstLetter = (difficulty) => {

    if (difficulty == "cplusplus") {
        return difficulty.charAt(0).toUpperCase() + "++"
    }

    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

const CriteriaDisplay = ({ difficulty, language }) => {
    return (
            <Card className="mt-3" style={{ width: '20rem' }}>
                <Card.Body>
                    <Card.Title>Selected Criteria</Card.Title>
                    <Card.Text>
                        <span>
                            Difficulty: <Badge bg={getBadgeVariant(difficulty ? difficulty : "Not Selected" )}>{capitalizeFirstLetter(difficulty ? difficulty : "Not Selected")}</Badge>
                            <br></br>
                            Language: <strong>{capitalizeFirstLetter(language ? language : "Not Selected")}</strong>
                        </span>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
};

export default CriteriaDisplay;