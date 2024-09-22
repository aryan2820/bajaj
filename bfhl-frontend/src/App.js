import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    document.title = 'RA2111003011804'; // Replace with your roll number
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData.data)) {
        setError('Input data must be an array.');
        return;
      }

      const response = await axios.post('http://localhost:3000/bfhl', {
        data: parsedData.data,
        file_b64: parsedData.file_b64 || ''
      });

      setResponseData(response.data);
      setError('');
      setShowDropdown(true);
    } catch (err) {
      setError('Invalid JSON or error while fetching data');
      setShowDropdown(false);
    }
  };

  const handleDropdownChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedOptions([...selectedOptions, value]);
    } else {
      setSelectedOptions(selectedOptions.filter(option => option !== value));
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { alphabets, numbers, highest_lowercase_alphabet } = responseData;
    let filteredResponse = {};

    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredResponse.highest_lowercase_alphabet = highest_lowercase_alphabet;
    }

    return (
      <div className="response-box">
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div>
      <h1>BFHL Challenge</h1>
      <textarea
        rows="10"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Enter valid JSON here..."
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p className="error">{error}</p>}

      {showDropdown && (
        <div className="dropdown-container">
          <h3>Select options to display:</h3>
          <label className="label">
            <input
              type="checkbox"
              value="Alphabets"
              onChange={handleDropdownChange}
            />
            Alphabets
          </label>
          <label className="label">
            <input
              type="checkbox"
              value="Numbers"
              onChange={handleDropdownChange}
            />
            Numbers
          </label>
          <label className="label">
            <input
              type="checkbox"
              value="Highest lowercase alphabet"
              onChange={handleDropdownChange}
            />
            Highest lowercase alphabet
          </label>
        </div>
      )}

      {renderResponse()}
    </div>
  );
}

export default App;