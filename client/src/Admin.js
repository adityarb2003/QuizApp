import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (token) fetchQuestions();
  }, [token]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/quiz/questions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      setToken(response.data.token);
      setRole(response.data.role);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || error.message));
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', registerData);
      alert('Registration successful! Please log in.');
      setIsRegistering(false);
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
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
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/quiz/questions', newQuestion, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
      setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    } catch (error) {
      alert('Error adding question: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/quiz/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchQuestions();
    } catch (error) {
      alert('Error deleting question: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  if (!token) {
    return (
      <div>
        <h1>{isRegistering ? 'Register' : 'Login'}</h1>
        {isRegistering ? (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <button type="submit">Register</button>
            <p>Already have an account? <button onClick={() => setIsRegistering(false)}>Login</button></p>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button type="submit">Login</button>
            <p>New here? <button onClick={() => setIsRegistering(true)}>Register</button></p>
          </form>
        )}
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div>
        <h1>Welcome, {loginData.username || 'User'}!</h1>
        <p>You’re logged in as a {role}, so you can only take the quiz.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <button onClick={handleLogout}>Logout</button>
      <h2>Add New Question</h2>
      <form onSubmit={handleAddQuestion}>
        <input type="text" name="question" placeholder="Question" value={newQuestion.question} onChange={(e) => handleInputChange(e)} />
        {newQuestion.options.map((option, index) => (
          <input key={index} type="text" name="options" placeholder={`Option ${index + 1}`} value={option} onChange={(e) => handleInputChange(e, index)} />
        ))}
        <input type="text" name="correctAnswer" placeholder="Correct Answer" value={newQuestion.correctAnswer} onChange={(e) => handleInputChange(e)} />
        <button type="submit">Add Question</button>
      </form>
      <h2>Existing Questions</h2>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            {q.question} - Correct: {q.correctAnswer}
            <button onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;