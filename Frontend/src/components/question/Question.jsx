import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CreateQn from "./CreateQn";
import EditQn from "./EditQn";
import questionService from "../../services/questions"

function Question() {
    const [questions, setQuestions] = useState([]);
    const [showComponent, setShowComponent] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const handleShow = () => setShowComponent(true);
    const handleClose = () => setShowComponent(false);

    useEffect(() => {
        questionService.getAll()
        .then(result => {
            setQuestions(result.data);
        })
        .catch(err => console.log(err));
    }, []);

    const easyQuestions = questions.filter(q => q.complexity === "Easy")
    const mediumQuestions = questions.filter(q => q.complexity === "Medium")
    const hardQuestions = questions.filter(q => q.complexity === "Hard")
    
    const addQuestion = (newQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

    
    const editQuestion = (id, updatedQuestion) => {
        const updatedQuestions = questions.map((q) =>
            q._id === id ? { ...q, ...updatedQuestion } : q
        );
        setQuestions(updatedQuestions);
    };

    const handleShowEditModal = (question) => {
        setCurrentQuestion(question);
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    // Show the delete confirmation modal
    const handleShowDelete = (id) => {
        setQuestionToDelete(id);
        setShowDeleteModal(true);
    };

    // Hide the delete confirmation modal
    const handleCloseDelete = () => {
        setShowDeleteModal(false);
        setQuestionToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (questionToDelete) {
            questionService.deleteQuestion(questionToDelete)
            .then(res => {
                console.log(res);
                setQuestions(questions.filter(question => question._id !== questionToDelete));
                handleCloseDelete();
            })
            .catch(err => console.log(err));
        }
    };

    const renderQuestionsTable = (questions) => {
      const sortedQuestions = [...questions].sort((a, b) => a.id - b.id)

        return (
            <Table>
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {sortedQuestions.map((question) => (
                    <tr key={question.id}>
                        <td>{question.id}</td>
                        <td>{question.title}</td>
                        <td>{question.description}</td>
                        <td>{question.category ? question.category.join(", ") : ''}</td>
                        <td>
                            <ButtonGroup className="mb-2">
                                <button 
                                    className='btn btn-success' 
                                    onClick={() => handleShowEditModal(question)}
                                >
                                    Edit
                                </button>
                                <button className='btn btn-danger' size="sm"
                                    onClick={() => handleShowDelete(question._id)}>
                                    Delete
                                </button>
                            </ButtonGroup>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        );
    };

    return (
        <div className="d-flex">
            <div className='bg-white rounded p-3 m-3'>
                <div className="d-flex justify-content-between">
                    <h1>Questions</h1>
                    <button className="btn btn-primary mt-3" onClick={() => handleShow()}>
                        {showComponent ? 'Hide' : 'Add question'}
                    </button>

                    <Modal show={showComponent} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Question</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CreateQn handleClose={handleClose} addQuestion={addQuestion}/>
                        </Modal.Body>
                    </Modal>
                </div>
                <hr/>

                <div className="container">
                    <h2 className="p-2">Easy Questions</h2>
                    {renderQuestionsTable(easyQuestions)}

                    <h2 className="p-2">Medium Questions</h2>
                    {renderQuestionsTable(mediumQuestions)}

                    <h2 className="p-2">Hard Questions</h2>
                    {renderQuestionsTable(hardQuestions)}

                        {/* Edit Modal */}
                        <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Question</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <EditQn 
                                    question={currentQuestion} 
                                    handleClose={handleCloseEditModal} 
                                    editQuestion={editQuestion}
                                />
                            </Modal.Body>
                        </Modal>

            
                    <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
                        <Modal.Body className="text-center">
                            <p>Delete question?</p>
                            <div>
                                <button className="btn btn-secondary me-2" onClick={handleCloseDelete}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDeleteConfirm}>Confirm</button>
                            </div>
                        </Modal.Body>
                    </Modal>
                    <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
                        <Modal.Body className="text-center">
                            <p>Delete question?</p>
                            <div>
                                <button className="btn btn-secondary me-2" onClick={handleCloseDelete}>Cancel</button>
                                <button className="btn btn-danger" onClick={handleDeleteConfirm}>Confirm</button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Question;
