import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get(`/api/questions/${id}`);
      setQuestion(res.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to answer');
      return;
    }

    try {
      const res = await axios.post('/api/answers', {
        content: answerContent,
        questionId: id
      });
      setAnswerContent('');
      setShowAnswerForm(false);
      fetchQuestion(); // Refresh to show new answer
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to post answer');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!question) {
    return <div className="container">Question not found</div>;
  }

  return (
    <div className="container">
      <div className="card question-detail-card">
        <div className="question-header">
          <Link to={`/profile/${question.author._id}`} className="question-author">
            {question.author.username}
          </Link>
          <span className="question-date">
            {new Date(question.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="question-title-large">{question.title}</h1>
        {question.description && (
          <p className="question-description-large">{question.description}</p>
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

      <div className="answers-section">
        <div className="answers-header">
          <h2>Answers ({question.answers?.length || 0})</h2>
          {user && (
            <button 
              onClick={() => setShowAnswerForm(!showAnswerForm)} 
              className="btn btn-primary"
            >
              {showAnswerForm ? 'Cancel' : 'Add Answer'}
            </button>
          )}
        </div>

        {showAnswerForm && (
          <div className="card">
            <form onSubmit={handleSubmitAnswer}>
              <div className="form-group">
                <label>Your Answer</label>
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer here..."
                  required
                  maxLength={5000}
                  rows={6}
                />
              </div>
              <button type="submit" className="btn btn-primary">Post Answer</button>
            </form>
          </div>
        )}

        {question.answers && question.answers.length > 0 ? (
          question.answers.map(answer => (
            <div key={answer._id} className="card answer-card">
              <div className="answer-header">
                <Link to={`/profile/${answer.author._id}`} className="answer-author">
                  {answer.author.username}
                </Link>
                <span className="answer-date">
                  {new Date(answer.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="answer-content">{answer.content}</p>
            </div>
          ))
        ) : (
          <div className="card">
            <p>No answers yet. Be the first to answer!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;



