import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionService from "../../services/questions";

function CreateQn({ handleClose, addQuestion }) {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [complexity, setComplexity] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Example category suggestions
  const suggestions = ["Abc", "Abcd", "Algorithms", "Arrays", "Data Structures", "Sorting", "Searching", "Graphs", "Trees", "Linked Lists"];

  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleAddCategory = () => {
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
      setCategoryInput('');
    }
  };

  const handleCategorySelect = (suggestion) => {
    if (!categories.includes(suggestion)) {
      setCategories([...categories, suggestion]);
    }
    setCategoryInput('');
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter((category) => category !== categoryToRemove));
  };

  const Submit = (e) => {
    e.preventDefault();
    const newQuestion = { category: categories, complexity, description, title };
    
    questionService.createQuestion(newQuestion)
      .then(result => {
        console.log(result.data);
        addQuestion(result.data);
        handleClose();
        navigate("/home");
      })
      .catch(e => {
        if (e.response && e.response.status === 400) {
          setError(e.response.data.error);
        }
        console.error('Error updating question:', e);
      });
  };

  // Determine if the suggestion container should be scrollable based on filtered suggestions count
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(categoryInput.toLowerCase())
  );
  const isScrollable = filteredSuggestions.length > 3;

  return (
    <div className='d-flex bg-primary justify-content-center align-items-center'>
      <div className="w-100 bg-white px-3 pb-3">
        <form onSubmit={Submit}>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="mb-2">
            <label htmlFor="">Title</label>
            <input type="text" placeholder='Shortest Distance' className='form-control'
              onChange={(e) => setTitle(e.target.value)} />
          </div>
          
          <div className="mb-2">
            <label htmlFor="">Category</label>
            <input
              type="text"
              placeholder='Find or create a category'
              className='form-control'
              value={categoryInput}
              onChange={handleCategoryInputChange}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
            />

            {/* Outer container with rounded corners and border */}
            {categoryInput && (
              <div style={{
                border: "1px solid #ccc",
                borderRadius: "6px",
                paddingTop: "2px",
                marginTop: "5px",
                maxWidth: "100%",
              }}>
                {/* Scrollable inner container for suggestion items */}
                <div style={{
                  maxHeight: "150px", // Approx height for 3 items
                  overflowY: isScrollable ? "scroll" : "hidden", // Scrollbar only if > 3 items
                  overflowX: "hidden",
                  scrollbarWidth: isScrollable ? "thin" : "none", // Firefox scrollbar control
                }}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleCategorySelect(suggestion)}
                      style={{
                        cursor: 'pointer',
                        padding: "10px 15px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        transition: "background-color 0.2s",
                        borderBottom: index === filteredSuggestions.length - 1 ? "none" : "1px solid #e0e0e0"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f3f5"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                    >
                      <span style={{ color: "#28a745", marginRight: "8px" }}>+</span>
                      {suggestion}
                    </li>
                  ))}
                </div>

                {/* "New category" item */}
                {!filteredSuggestions.some(suggestion => suggestion.toLowerCase() === categoryInput.toLowerCase()) && (
                  <li
                    onClick={handleAddCategory}
                    style={{
                      cursor: 'pointer',
                      padding: "10px 15px",
                      fontStyle: 'italic',
                      color: 'gray',
                      backgroundColor: "#fff",
                      display: "flex",
                      alignItems: "center",
                      transition: "background-color 0.2s",
                      borderTop: "1px solid #e0e0e0", // Border above if there are suggestions
                      borderBottomRightRadius: "6px",
                      borderBottomLeftRadius: "6px",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f1f3f5"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                  >
                    New category: "{categoryInput}". Press Enter to add.
                  </li>
                )}
              </div>
            )}

            {/* Display selected categories as tags */}
            <div style={{ marginTop: '10px' }}>
              {categories.map((category, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    padding: '5px',
                    margin: '5px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRemoveCategory(category)}
                >
                  {category} &times;
                </span>
              ))}
            </div>
          </div>
          
          <div className="container my-3">
            <h5>Complexity</h5>
            <div className="form-check">
              <input type="radio" id="easy" value="Easy" name="complexity"
                onChange={(e) => setComplexity(e.target.value)} />
              <label className="form-check-label" htmlFor="easy">Easy</label>
            </div>
            <div className="form-check">
              <input type="radio" id="medium" value="Medium" name="complexity"
                onChange={(e) => setComplexity(e.target.value)} />
              <label className="form-check-label" htmlFor="medium">Medium</label>
            </div>
            <div className="form-check">
              <input type="radio" id="hard" value="Hard" name="complexity"
                onChange={(e) => setComplexity(e.target.value)} />
              <label className="form-check-label" htmlFor="hard">Hard</label>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="">Description</label>
            <input type="text" placeholder='Return the largest....' className='form-control'
              onChange={(e) => setDescription(e.target.value)} />
          </div>

          <button className="btn btn-success">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateQn;
