// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import axios from 'axios';
// import Admin from './Admin';
// import './App.css';

// function Quiz() {
//   const [questions, setQuestions] = useState([]);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [answers, setAnswers] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (token) {
//       axios.get('http://localhost:5000/api/quiz/questions', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//         .then(response => setQuestions(response.data))
//         .catch(error => console.log(error.response?.data || error.message));
//     }
//   }, [token]);

//   // Save score when quiz is finished and we have all answers
//   useEffect(() => {
//     if (showScore && answers.length === questions.length) {
//       saveScore();
//     }
//   }, [showScore, answers, questions.length, score]);

//   const handleAnswer = (selectedOption) => {
//     // Check if answer is correct
//     const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    
//     // Update score if correct
//     if (isCorrect) {
//       setScore(score + 1);
//     }
    
//     // Record this answer
//     const currentQuestionId = questions[currentQuestion]._id;
//     setAnswers([...answers, {
//       questionId: currentQuestionId,
//       selectedAnswer: selectedOption,
//       isCorrect: isCorrect
//     }]);
    
//     // Move to next question or finish quiz
//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestion(nextQuestion);
//     } else {
//       console.log('Quiz finished, answers collected:', answers.length + 1);
//       setShowScore(true);
//     }
//   };

//   const restartQuiz = () => {
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowScore(false);
//     setAnswers([]);
//   };

//   const saveScore = async () => {
//     console.log('Saving score with:', { answers, totalScore: score });
//     try {
//       const response = await axios.post('http://localhost:5000/api/quiz/scores', 
//         { answers, totalScore: score }, 
//         { headers: { Authorization: `Bearer ${token}` }}
//       );
//       console.log('Score saved successfully:', response.data);
//     } catch (error) {
//       console.error('Error saving score:', error.response?.data || error.message);
//     }
//   };

//   if (!token) {
//     return (
//       <div className="App">
//         <h2>Please log in to take the quiz</h2>
//         <Link to="/admin">Go to Login</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="App">
//       {showScore ? (
//         <div>
//           <h1>Your Score: {score} / {questions.length}</h1>
//           <button onClick={restartQuiz}>Restart Quiz</button>
//         </div>
//       ) : questions.length > 0 ? (
//         <div>
//           <h2>{questions[currentQuestion].question}</h2>
//           <div>
//             {questions[currentQuestion].options.map((option, index) => (
//               <button key={index} onClick={() => handleAnswer(option)}>
//                 {option}
//               </button>
//             ))}
//           </div>
//         </div>
//       ) : (
//         <h2>Loading...</h2>
//       )}
//     </div>
//   );
// }

// function App() {
//   const role = localStorage.getItem('role');

//   return (
//     <Router>
//       <nav>
//         <Link to="/">Quiz</Link>
//         {role === 'admin' && <span> | <Link to="/admin">Admin</Link></span>}
//         {!role && <span> | <Link to="/admin">Login</Link></span>}
//       </nav>
//       <Routes>
//         <Route path="/" element={<Quiz />} />
//         <Route path="/admin" element={<Admin />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.get('http://localhost:5000/api/quiz/questions', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          setQuestions(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.log(error.response?.data || error.message);
          setLoading(false);
        });
    }
  }, [token]);

  // Save score when quiz is finished and we have all answers
  useEffect(() => {
    if (showScore && answers.length === questions.length) {
      saveScore();
    }
  }, [showScore, answers, questions.length, score]);

  const handleAnswer = (selectedOption) => {
    // Check if answer is correct
    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    
    // Update score if correct
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Record this answer
    const currentQuestionId = questions[currentQuestion]._id;
    setAnswers([...answers, {
      questionId: currentQuestionId,
      selectedAnswer: selectedOption,
      isCorrect: isCorrect
    }]);
    
    // Move to next question or finish quiz
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      console.log('Quiz finished, answers collected:', answers.length + 1);
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
      const response = await axios.post('http://localhost:5000/api/quiz/scores', 
        { answers, totalScore: score }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      console.log('Score saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving score:', error.response?.data || error.message);
    }
  };

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h2>Please log in to take the quiz</h2>
          <Link to="/admin" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {showScore ? (
        <div className="card result-card">
          <h1 className="score-title">Your Score</h1>
          <div className="score-display">
            <span className="score-number">{score}</span>
            <span className="score-divider">/</span>
            <span className="total-number">{questions.length}</span>
          </div>
          <button onClick={restartQuiz} className="btn btn-primary">Restart Quiz</button>
        </div>
      ) : loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading questions...</p>
        </div>
      ) : questions.length > 0 ? (
        <div className="card quiz-card">
          <div className="quiz-header">
            <div className="quiz-progress">
              <div 
                className="progress-bar" 
                style={{width: `${(currentQuestion / questions.length) * 100}%`}}
              ></div>
            </div>
            <div className="question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <h2 className="question-text">{questions[currentQuestion].question}</h2>
          <div className="options-container">
            {questions[currentQuestion].options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(option)}
                className="option-btn"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card">
          <h2>No questions available</h2>
        </div>
      )}
    </div>
  );
}

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo">QuizMaster</div>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Quiz</Link>
            {role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            {!token && <Link to="/admin" className="nav-link">Login</Link>}
            {token && <Link to="/" className="nav-link user-status">
              {role === 'admin' ? '👑 Admin' : '👤 User'}
            </Link>}
          </nav>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <p>© 2025 QuizMaster - Learn and Test Your Knowledge</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;