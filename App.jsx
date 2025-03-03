import { useState } from "react";
import "./App.css";
import logo from './assets/logo.jpeg';  // Make sure this path matches your file structure

function App() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [history, setHistory] = useState([]);

  const apiUrl =
  process.env.NODE_ENV === "production"
    ? "https://medai-1k11pl7cp-farhans-projects-8b44be34.vercel.app/analyze" // Production URL
    : "http://127.0.0.1:5001/analyze"; // Local URL for development

const handleSubmit = async (e) => {
  e.preventDefault();
  setResult("Analyzing symptoms...");

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms }),
    });

    const data = await response.json();
    const newResult = `Possible Condition: ${data.condition} (Confidence: ${(data.confidence * 100).toFixed(2)}%)`;
    setResult(newResult);
    setHistory([...history, { symptoms, result: newResult }]);
  } catch (error) {
    setResult("Error analyzing symptoms.");
  }
};


  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    console.log("Dark mode toggled:", !darkMode);
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : ""}`}>
      <img 
        src={logo} 
        alt="MedAI Logo" 
        className="logo" 
        onError={(e) => console.log('Image failed to load:', e)}
      />
      <div className="options-toggle" onClick={toggleOptions}>
        <div className="menu-icon">&#9776;</div> {/* Hamburger menu icon */}
      </div>
      {showOptions && (
        <div className="options">
          <button onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={() => alert("History feature coming soon!")}>
            View History
          </button>
        </div>
      )}
      <h1>MedAI Symptom Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter symptoms (e.g., fever, cough)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button type="submit">Analyze</button>
      </form>
      {result && (
        <div className="result">
          <h2>Analysis Result</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default App;
