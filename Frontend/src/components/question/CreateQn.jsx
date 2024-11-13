import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questionService from "../../services/questions";
import categoryService from "../../services/categories";

function CreateQn({ handleClose, addQuestion }) {
  const [categories, setCategories] = useState([]); 
  const [categoryInput, setCategoryInput] = useState('');
  const [categoriesFromDB, setCategoriesFromDB] = useState([]);
  const [complexity, setComplexity] = useState('');
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    categoryService.getAllCategories()
      .then(result => {
        // console.log("API call successful. Result:", result);
        setCategoriesFromDB(Array.isArray(result) ? result : []);
        // console.log("categoriesFromDB after set:", categoriesFromDB);
      })
      .catch(err => console.log("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    console.log("categoriesFromDB updated:", categoriesFromDB);
  }, [categoriesFromDB]);

  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
  };

  const handleAddCategory = () => {
    if (categoryInput && !categories.includes(categoryInput)) {
      setCategories([...categories, categoryInput]);
    }
    console.log(`categories are: ${categories}`);
    setCategoryInput('');
  };

  const handleCategorySelect = (suggestion) => {
    if (!categories.includes(suggestion.name)) {
      setCategories([...categories, suggestion.name]);
    }
    setCategoryInput('');
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setCategories(categories.filter((category) => category !== categoryToRemove));
  };

  const Submit = (e) => {
    e.preventDefault();
    const newQuestion = { category: categories, complexity, description, title };
    // Map `categoriesFromDB` to get an array of names
    const dbTopicNames = categoriesFromDB.map(cat => cat.name);

    // Filter `categories` to get only new topics that aren’t in `dbTopicNames`
    const newCategories = categories.filter(item => !dbTopicNames.includes(item));

    console.log(`newCategories are ${newCategories}`);
    console.log(`newQuestion are ${newQuestion}`);
    
    categoryService.createCategories(newCategories)
      .then(result => console.log(result.data))
      .catch(e => {
        if (e.response && e.response.status === 400) {
          setError(e.response.data.error);
        }
        console.error('Error updating category:', e);
      });

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

  const filteredSuggestions = Array.isArray(categoriesFromDB)
    ? categoriesFromDB.filter(suggestion =>
        suggestion.name.toLowerCase().includes(categoryInput.toLowerCase())
      )
    : [];

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
                  overflowY: "auto", // Scrollbar only if > 3 items
                  overflowX: "hidden",
                }}>
                  {filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleCategorySelect(suggestion)}
                      style={{
                        cursor: 'pointer',
                        padding: "10px 10px",
                        margin: "0px 10px",
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
                      {suggestion.name}
                    </li>
                  ))}
                </div>

                {/* "New category" item */}
                {!filteredSuggestions.some(suggestion => suggestion.name.toLowerCase() === categoryInput.toLowerCase()) && (
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
            <textarea
                placeholder="Return the largest..."
                className="form-control"
                style={{ height: '100px', resize: 'none' }} // Fixed height of 100px, remove "resize: none" if you want to allow resizing
                onChange={(e) => setDescription(e.target.value)}
                value={description} // Assuming `description` is the state variable holding the value
            />
          </div>

          <button className="btn btn-success">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default CreateQn;
