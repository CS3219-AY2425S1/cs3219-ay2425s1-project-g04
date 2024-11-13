import React, { useState, useEffect } from 'react';
import { Card, Col} from 'react-bootstrap';
import { getQuestionsByCategory } from '../../services/questions';

const QuestionDisplay = ({ question }) => {
    // const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    // const [cats, setCats] = useState(null)

    if (error) {
        return <p>{error}</p>;
    }

    return (
            <Card style={{ width: '100%' }}>
                <Card.Header>{question ? <strong>{question.title} ({question.complexity})</strong> : "Loading..."}</Card.Header>
                <Card.Body style={{ textAlign: 'left' }}>
                    <p>{question ? "Category: " + question.category.join(", ") : "Loading question description..."}</p>
                    <p> Description:</p>
                    <p>{question ? question.description : "Loading question description..."}</p>
                </Card.Body>
            </Card>
    );
};

export default QuestionDisplay;
