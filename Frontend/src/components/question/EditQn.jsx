import React from 'react'
import { useState } from 'react'
import questionService from "../../services/questions"

function EditQn({ question, handleClose, editQuestion }) {
    const [category, setCategory] = useState(question.category);
    const [complexity, setComplexity] = useState(question.complexity);
    const [description, setDescription] = useState(question.description);
    const [title, setTitle] = useState(question.title);
    const [error, setError] = useState(null);

    const Update = (e) => {
      e.preventDefault();

    // To remove empty strings and extra spaces
    const delimeter = ", "
    const categoryString = category.join(delimeter);
    const cleanedCategoryArray = categoryString.split(delimeter).filter(item => item.trim() !== "");

    const updatedQuestion = {
        category: cleanedCategoryArray,
        complexity, 
        description,
        title,
    };
    console.log("category array: ", cleanedCategoryArray)
    console.log("db_id:", question._id)
    console.log(category, complexity, description, title);

    questionService.updateQuestion(question._id, updatedQuestion)
        .then(result => {
            
            editQuestion(question._id, updatedQuestion);
            console.log('Question edited successfully:', result)
            handleClose(); 
        })
        .catch(e => {
            if (e.response && e.response.status === 400) {
                setError(e.response.data.error)
                // console.log("error is:", error)
            }
            console.error('Error updating question:', e);
        });
};

  return (
    <div className='d-flex bg-primary justify-content-center align-items-center'>
        <div className="w-100 bg-white px-3 pb-3">
            <form onSubmit={Update}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-2">
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder='Shortest Distance' className='form-control'
                    value={title} onChange={e => setTitle(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Category</label>
                    <input type="text" placeholder='Data Structures' className='form-control'
                    value={category.join(",")} onChange={(e) => setCategory(e.target.value.split(","))}/>
                </div>
                <div className="container my-3">
                    <h5>Complexity</h5>
                    <div className="form-check">
                        <input type="radio" id="easy" value="Easy" checked={complexity === "Easy"} onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="easy">Easy</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="medium" value="Medium" checked={complexity === "Medium"} onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="medium">Medium</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="hard" value="Hard" checked={complexity === "Hard"} onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="">Description</label>
                    <input type="text" placeholder='Return the largest....' className='form-control' 
                    value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>

                <button className="btn btn-success">Update</button>
            </form>
        </div>
    </div>
  )
}

export default EditQn