import React from 'react'
import { useState, useEffect } from 'react'

function DetailQn({ question, handleClose }) {
    const [categories, setCategories] = useState(question.category);
    const [complexity, setComplexity] = useState(question.complexity);
    const [description, setDescription] = useState(question.description);
    const [title, setTitle] = useState(question.title);
    const [error, setError] = useState(null);

  return (
    <div className='d-flex bg-primary justify-content-center align-items-center'>
        <div className="w-100 bg-white px-3 pb-3">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-2">
                <b>Title</b>
                <div className="mt-1">
                    <p>{title}</p>
                </div>
            </div>
            <div className="mb-2">
                <b>Category</b>

                {/* Display selected categories as tags */}
                <div style={{ marginTop: '5px' }}>
                {categories.map((category, index) => (
                    <span
                    key={index}
                    style={{
                        display: 'inline-block',
                        padding: '5px',
                        margin: '5px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '5px'
                    }}
                    >
                    {category}
                    </span>
                ))}
                </div>
            </div>
            <b>Complexity</b>
            <div className="mt-1">
                    <p>{complexity}</p>
                </div>
            <div className="mb-3">
                <b>Description</b>
                <div className="mt-1">
                    <p>
                        {description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                            {line}
                            <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DetailQn