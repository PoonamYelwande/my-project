import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDescription, setQuestionDescription] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('/api/questions');
      setQuestions(res.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to ask a question');
      return;
    }

    try {
      const res = await axios.post('/api/questions', {
        title: questionTitle,
        description: questionDescription
      });
      setQuestions([res.data, ...questions]);
      setQuestionTitle('');
      setQuestionDescription('');
      setShowQuestionForm(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post question');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="home-header">
        <h1>Latest Questions</h1>
        {user && (
          <button 
            onClick={() => setShowQuestionForm(!showQuestionForm)} 
            className="btn btn-primary"
          >
            {showQuestionForm ? 'Cancel' : 'Ask Question'}
          </button>
        )}
      </div>

      {showQuestionForm && (
        <div className="card">
          <h2>Ask a Question</h2>
          <form onSubmit={handleSubmitQuestion}>
            <div className="form-group">
              <label>Question Title *</label>
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="What's your question?"
                required
                maxLength={200}
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={questionDescription}
                onChange={(e) => setQuestionDescription(e.target.value)}
                placeholder="Add more details about your question..."
                maxLength={2000}
              />
            </div>
            <button type="submit" className="btn btn-primary">Post Question</button>
          </form>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="card">
          <p>No questions yet. Be the first to ask!</p>
        </div>
      ) : (
        questions.map(question => (
          <div key={question._id} className="card question-card">
            <div className="question-header">
              <Link to={`/profile/${question.author._id}`} className="question-author">
                {question.author.username}
              </Link>
              <span className="question-date">
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
            <Link to={`/question/${question._id}`} className="question-link">
              <h2 className="question-title">{question.title}</h2>
            </Link>
            {question.description && (
              <p className="question-description">{question.description}</p>
            )}
            <div className="question-footer">
              <span className="question-stats">
                {question.answers?.length || 0} {question.answers?.length === 1 ? 'answer' : 'answers'}
              </span>
              <span className="question-stats">
                {question.views || 0} {question.views === 1 ? 'view' : 'views'}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;



