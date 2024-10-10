import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import questionService from "../../services/questions"


function CreateQn({handleClose, addQuestion}) {
  const [category, setCategory] = useState([])
  const [complexity, setComplexity] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  const Submit = (e) => {
    e.preventDefault();
    const newQuestion = { category, complexity, description, title};
    //console.log(newQuestion)
    questionService.createQuestion(newQuestion)
    .then(result => {
        // Add the new question to the question list in Question.jsx
        console.log(result.data)
        addQuestion(result.data)
        handleClose()
        navigate("/home")
      } 
    )
    .catch(e => {
        if (e.response && e.response.status === 400) {
                setError(e.response.data.error)
                // console.log("error is:", error)
            }
            console.error('Error updating question:', e);
    })
  }

  return (
    <div className='d-flex bg-primary justify-content-center align-items-center'>
        <div className="w-100 bg-white px-3 pb-3">
            <form onSubmit={Submit}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-2">
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder='Shortest Distance' className='form-control'
                    onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="mb-2">
                    <label htmlFor="">Category</label>
                    <input type="text" placeholder='Data Structures' className='form-control'
                    onChange={(e) => setCategory(e.target.value.split(","))}/>
                </div>
                <div className="container my-3">
                    <h5>Complexity</h5>
                    <div className="form-check">
                        <input type="radio" id="easy" value="Easy" name={"complexity"} 
                        onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="easy">Easy</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="medium" value="Medium" name={"complexity"} 
                        onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="medium">Medium</label>
                    </div>
                    <div className="form-check">
                        <input type="radio" id="hard" value="Hard" name={"complexity"} 
                        onChange={(e) => setComplexity(e.target.value)}/>
                        <label className="form-check-label" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="">Description</label>
                    <input type="text" placeholder='Return the largest....' className='form-control'
                    onChange={(e) => setDescription(e.target.value)}/>
                </div>

                <button className="btn btn-success">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CreateQn