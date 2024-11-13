import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CreateQn from "./CreateQn";
import EditQn from "./EditQn";
import DetailQn from "./DetailQn";
import questionService from "../../services/questions"
import userService from "../../services/users";
import categoryService from "../../services/categories";
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

function Question() {
    const [questions, setQuestions] = useState([]);
    const [showComponent, setShowComponent] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const handleShow = () => setShowComponent(true);
    const handleClose = () => setShowComponent(false);

    useEffect(() => {
        questionService.getAll()
        .then(result => {
            setQuestions(result.data);
        })
        
        .catch(err => console.log(err));
    }, []);

    {/* Added to check the authorization status to determine whether to show edit, delete, add buttons */}

    useEffect(() => {
        const token = sessionStorage.getItem('jwt_token');
        const authHeader = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        // verify token asynchronously, set auth status only after request completes
        userService.verifyAdmin(authHeader)
        .then(response => {
            if (response.status == 200) {
                setIsAdmin(true);
            }
        })
        .catch(e => {
            console.log('Error:', e);
        });
    }, []);
    
    const addQuestion = (newQuestion) => {
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

    const handleShowDetailModal = (question) => {
        setCurrentQuestion(question);
        setShowDetailModal(true);
    }

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
    }

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
        if (!questionToDelete) return;
    
        // retrieve the question to get its categories before deleting
        questionService.get(questionToDelete)
            .then((question) => {
                const categories = question.data.category;
                console.log("question retrieved: ", question)
                console.log(`catgories of qn: ${categories}`)
    
                // delete the question
                questionService.deleteQuestion(questionToDelete)
                    .then(res => {
                        console.log(res);
                        
                       
                        setQuestions(questions.filter(q => q._id !== questionToDelete));
                        handleCloseDelete();
    
                        // check each category to see if it should be deleted
                        categories.forEach(async (category) => {
                            try {
                                const remainingQuestions = await questionService.getQuestionsByCategory(category);
                                
                                // if no other questions have this category, delete the category
                                if (remainingQuestions.length === 0) {
                                    await categoryService.deleteCategory(category);
                                    console.log(`Category ${category} deleted.`);
                                }
                            } catch (err) {
                                console.error(`Error processing category ${category}:`, err);
                            }
                        });
                    })
                    .catch(err => console.error("Error deleting question:", err));
            })
            .catch(err => console.error(`Error fetching question data for ID ${questionToDelete}:`, err));
    };
    

    const renderQuestionsTable = () => {
        const editDeleteButtonComponent = (props) => {
            const question = props.data;
            return (
                <ButtonGroup className="container-fluid mt-1 mb-1">
                    <button 
                        className='btn btn-success btn-sm' 
                        onClick={() => handleShowEditModal(question)}
                    >
                        Edit
                    </button>
                    <button className='btn btn-danger btn-sm' size="sm"
                        onClick={() => handleShowDelete(question._id)}>
                        Delete
                    </button>
                </ButtonGroup>
            );
        };

        const showDetailButtonComponent = (props) => {
            const question = props.data;
            return (
                <ButtonGroup className="container-fluid mt-1 mb-1">
                    <button 
                        className='btn btn-info btn-sm' 
                        onClick={() => handleShowDetailModal(question)}
                    >
                        Show Details
                    </button>
                </ButtonGroup>
            );
        };
    
        const colDefs = [
            { field: "id", flex: 1, wrapText: true, sort: "asc" },
            { field: "title", flex: 4, wrapText: true},
            { field: "category", flex: 3, autoHeight: true, cellDataType: 'text' },
            { 
                field: "complexity", 
                flex: 1.5,
                comparator: (valueA, valueB) => {
                    if (valueA === valueB) return 0;
                    if (valueA === "Easy" || valueB === "Hard") return -1;
                    if (valueA === "Hard" || valueB === "Easy") return 1;
                }
            },
            {
                field: "details", 
                width: 200, 
                resizable: false,  
                sortable: false, 
                cellRenderer: showDetailButtonComponent },
                ...(isAdmin ? [{
                field: "action", 
                width: 200, 
                resizable: false,  
                sortable: false, 
                cellRenderer: editDeleteButtonComponent 
            }] : [])
        ];
    
        return (
            <div
                className="container-fluid ag-theme-quartz"
                style={{ height: '80vh' }}
            >
                <AgGridReact
                    rowData={questions}
                    columnDefs={colDefs}
                />
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className='bg-white rounded p-3 m-3'>
                <div className="d-flex justify-content-between">
                    <h1>Questions</h1>
                    {isAdmin && (
                        <button className="btn btn-primary mt-3" onClick={() => handleShow()}>
                            {showComponent ? 'Hide' : 'Add question'}
                        </button>
                    )}
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
                    {renderQuestionsTable()}

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

                        {/* Detail Modal */}
                        <Modal show={showDetailModal} onHide={handleCloseDetailModal} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Question Details</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <DetailQn 
                                    question={currentQuestion} 
                                    handleClose={handleCloseDetailModal}
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
