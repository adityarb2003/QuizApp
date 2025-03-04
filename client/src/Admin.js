import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RetroAdmin.css'; 

function RetroAdmin() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);
    const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (token) fetchQuestions();
    
    // Add retro arcade sound effect on load
    const audioElement = new Audio('/arcade-start.mp3');
    audioElement.volume = 0.2;
    audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
    
    // Simulate old CRT monitor flicker
    const flickerInterval = setInterval(() => {
      const root = document.documentElement;
      const flicker = Math.random() > 0.97;
      root.style.setProperty('--flicker', flicker ? '0.97' : '1');
    }, 100);
    
    return () => clearInterval(flickerInterval);
  }, [token]);

  const fetchQuestions = async () => {
    try {
      setShowControls(true);
      const response = await axios.get('http://localhost:5000/api/quiz/questions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeout(() => {
        setQuestions(response.data);
        setShowControls(false);
      }, 1000); // Add delay for retro loading effect
    } catch (error) {
      console.error('Error fetching questions:', error);
      setShowControls(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setShowControls(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      
      // Play success sound
      const audioElement = new Audio('/level-up.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      setTimeout(() => {
        setToken(response.data.token);
        setRole(response.data.role);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        setShowControls(false);
      }, 800);
    } catch (error) {
      // Play error sound
      const audioElement = new Audio('/error.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      alert('LOGIN FAILED: ' + (error.response?.data?.message || error.message));
      setShowControls(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setShowControls(true);
      await axios.post('http://localhost:5000/api/auth/register', registerData);
      
      // Play success sound
      const audioElement = new Audio('/powerup.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      setTimeout(() => {
        alert('REGISTRATION COMPLETE! PRESS START TO LOGIN.');
        setIsRegistering(false);
        setShowControls(false);
      }, 800);
    } catch (error) {
      // Play error sound
      const audioElement = new Audio('/error.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      alert('REGISTRATION FAILED: ' + (error.response?.data?.message || error.message));
      setShowControls(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'options') {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({ ...newQuestion, options: updatedOptions });
    } else {
      setNewQuestion({ ...newQuestion, [name]: value });
    }
    
    // Type sound effect
    const audioElement = new Audio('/key-press.mp3');
    audioElement.volume = 0.05;
    audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      setShowControls(true);
      await axios.post('http://localhost:5000/api/quiz/questions', newQuestion, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Play success sound
      const audioElement = new Audio('/item-get.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      fetchQuestions();
      setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    } catch (error) {
      // Play error sound
      const audioElement = new Audio('/error.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      alert('ERROR ADDING QUESTION: ' + (error.response?.data?.message || error.message));
      setShowControls(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      setShowControls(true);
      await axios.delete(`http://localhost:5000/api/quiz/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Play delete sound
      const audioElement = new Audio('/explosion.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      fetchQuestions();
    } catch (error) {
      // Play error sound
      const audioElement = new Audio('/error.mp3');
      audioElement.volume = 0.2;
      audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
      
      alert('ERROR DELETING QUESTION: ' + (error.response?.data?.message || error.message));
      setShowControls(false);
    }
  };

  const handleLogout = () => {
    // Play logout sound
    const audioElement = new Audio('/game-over.mp3');
    audioElement.volume = 0.2;
    audioElement.play().catch(e => console.log('Audio autoplay blocked by browser'));
    
    setTimeout(() => {
      setToken('');
      setRole('');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }, 500);
  };

  if (!token) {
    return (
      <div className="retro-container">
        <div className="scanlines"></div>
        <div className="glitch-overlay"></div>
        <div className="retro-screen">
          <h1 className="retro-title blink">{isRegistering ? 'NEW PLAYER' : 'PLAYER LOGIN'}</h1>
          
          <div className="pixel-border">
            {isRegistering ? (
              <form onSubmit={handleRegister} className="retro-form">
                <div className="form-row">
                  <label>USERNAME:</label>
                  <input
                    type="text"
                    className="retro-input"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>PASSWORD:</label>
                  <input
                    type="password"
                    className="retro-input"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  />
                </div>
                <button type="submit" className="retro-button">REGISTER</button>
                <p className="retro-text">ALREADY HAVE ACCOUNT? <button className="text-button" onClick={() => setIsRegistering(false)}>LOGIN</button></p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="retro-form">
                <div className="form-row">
                  <label>USERNAME:</label>
                  <input
                    type="text"
                    className="retro-input"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  />
                </div>
                <div className="form-row">
                  <label>PASSWORD:</label>
                  <input
                    type="password"
                    className="retro-input"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>
                <button type="submit" className="retro-button">START</button>
                <p className="retro-text">NEW PLAYER? <button className="text-button" onClick={() => setIsRegistering(true)}>REGISTER</button></p>
              </form>
            )}
          </div>
          
          {showControls && <div className="loading">LOADING...</div>}
          <div className="retro-footer">
            <p>© 2025 RETRO QUIZ ADMIN v1.0</p>
            <p>INSERT COIN TO CONTINUE</p>
          </div>
        </div>
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="retro-container">
        <div className="scanlines"></div>
        <div className="glitch-overlay"></div>
        <div className="retro-screen">
          <h1 className="retro-title">PLAYER MODE</h1>
          <div className="pixel-border">
            <div className="retro-content">
              <p className="retro-text">WELCOME, {loginData.username.toUpperCase() || 'PLAYER'}!</p>
              <p className="retro-text blink">ACCESS DENIED</p>
              <p className="retro-text">YOU ARE {role.toUpperCase()}, NOT ADMIN.</p>
              <p className="retro-text">PRESS CONTINUE TO PLAY QUIZ.</p>
            </div>
          </div>
          <button onClick={handleLogout} className="retro-button">EXIT GAME</button>
          <div className="retro-footer">
            <p>© 2025 RETRO QUIZ ADMIN v1.0</p>
            <p>PRESS B TO GO BACK</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="retro-container">
      <div className="scanlines"></div>
      <div className="glitch-overlay"></div>
      <div className="retro-screen">
        <div className="retro-header">
          <h1 className="retro-title">ADMIN CONSOLE</h1>
          <button onClick={handleLogout} className="retro-button small">LOGOUT</button>
        </div>
        
        <div className="retro-section">
          <h2 className="retro-subtitle">ADD NEW QUEST</h2>
          <div className="pixel-border">
            <form onSubmit={handleAddQuestion} className="retro-form">
              <div className="form-row">
                <label>QUEST:</label>
                <input 
                  type="text" 
                  name="question" 
                  className="retro-input" 
                  value={newQuestion.question} 
                  onChange={(e) => handleInputChange(e)} 
                />
              </div>
              
              {newQuestion.options.map((option, index) => (
                <div key={index} className="form-row">
                  <label>OPT {index + 1}:</label>
                  <input 
                    type="text" 
                    name="options" 
                    className="retro-input" 
                    value={option} 
                    onChange={(e) => handleInputChange(e, index)} 
                  />
                </div>
              ))}
              
              <div className="form-row">
                <label>ANSWER:</label>
                <input 
                  type="text" 
                  name="correctAnswer" 
                  className="retro-input" 
                  value={newQuestion.correctAnswer} 
                  onChange={(e) => handleInputChange(e)} 
                />
              </div>
              
              <button type="submit" className="retro-button">SAVE</button>
            </form>
          </div>
        </div>
        
        <div className="retro-section">
          <h2 className="retro-subtitle">QUEST DATABASE</h2>
          <div className="pixel-border">
            {showControls ? (
              <div className="loading">LOADING...</div>
            ) : (
              <ul className="retro-list">
                {questions.length === 0 ? (
                  <li className="retro-text">NO QUESTS FOUND</li>
                ) : (
                  questions.map((q) => (
                    <li key={q._id} className="retro-list-item">
                      <div className="quest-text">{q.question}</div>
                      <div className="quest-answer">ANS: {q.correctAnswer}</div>
                      <button 
                        onClick={() => handleDeleteQuestion(q._id)} 
                        className="pixel-button delete"
                      >
                        DELETE
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
        
        <div className="retro-footer">
          <p>© 2025 RETRO QUIZ ADMIN v1.0</p>
          <p>A+B+SELECT TO RESET CONSOLE</p>
        </div>
      </div>
    </div>
  );
}

export default RetroAdmin;