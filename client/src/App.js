import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import Admin from './Admin';
import './App.css';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/quiz/questions', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setQuestions(response.data))
        .catch(error => console.log(error.response?.data || error.message));
    }
  }, [token]);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      console.log('Quiz finished, saving score...');
      saveScore(); // Ensure this runs
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setAnswers([]);
  };
  const saveScore = async () => {
    console.log('Saving score with:', { answers, totalScore: score });
    try {
      const response = await axios.post('http://localhost:5000/api/quiz/scores', { answers, totalScore: score }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Score saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving score:', error.response?.data || error.message);
    }
  };

  if (!token) {
    return (
      <div className="App">
        <h2>Please log in to take the quiz</h2>
        <Link to="/admin">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="App">
      {showScore ? (
        <div>
          <h1>Your Score: {score} / {questions.length}</h1>
          <button onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : questions.length > 0 ? (
        <div>
          <h2>{questions[currentQuestion].question}</h2>
          <div>
            {questions[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}

function App() {
  const role = localStorage.getItem('role');

  return (
    <Router>
      <nav>
        <Link to="/">Quiz</Link>
        {role === 'admin' && <span> | <Link to="/admin">Admin</Link></span>}
        {!role && <span> | <Link to="/admin">Login</Link></span>}
      </nav>
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

