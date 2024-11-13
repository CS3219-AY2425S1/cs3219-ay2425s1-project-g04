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

const CriteriaDisplay = ({ difficulty, category }) => {
    return (
        <Card className="mt-3 mx-auto" style={{ maxWidth: '100%', width: '90%', minWidth: '200px' }}>
        <Card.Body>
            <Card.Title>Selected Criteria</Card.Title>
            <Card.Text>
                <span>
                    Complexity: <Badge bg={getBadgeVariant(difficulty ? difficulty : "Not Selected")}>
                        {capitalizeFirstLetter(difficulty ? difficulty : "Not Selected")}
                    </Badge>
                    <br />
                    Category: <strong>{capitalizeFirstLetter(category ? category : "Not Selected")}</strong>
                </span>
            </Card.Text>
        </Card.Body>
    </Card>
        )
};

export default CriteriaDisplay;