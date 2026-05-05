import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!profile) {
    return <div className="container">User not found</div>;
  }

  const isOwnProfile = user && user.id === profile.user._id;

  return (
    <div className="container">
      <div className="card profile-header">
        <h1>{profile.user.username}</h1>
        <p className="profile-email">{profile.user.email}</p>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{profile.questions.length}</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{profile.answers.length}</span>
            <span className="stat-label">Answers</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          Questions ({profile.questions.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'answers' ? 'active' : ''}`}
          onClick={() => setActiveTab('answers')}
        >
          Answers ({profile.answers.length})
        </button>
      </div>

      {activeTab === 'questions' && (
        <div className="profile-content">
          {profile.questions.length === 0 ? (
            <div className="card">
              <p>No questions asked yet.</p>
            </div>
          ) : (
            profile.questions.map(question => (
              <div key={question._id} className="card question-card">
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
                    {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'answers' && (
        <div className="profile-content">
          {profile.answers.length === 0 ? (
            <div className="card">
              <p>No answers given yet.</p>
            </div>
          ) : (
            profile.answers.map(answer => (
              <div key={answer._id} className="card answer-card">
                <Link to={`/question/${answer.question._id}`} className="answer-question-link">
                  <h3 className="answer-question-title">Q: {answer.question.title}</h3>
                </Link>
                <div className="answer-header">
                  <span className="answer-date">
                    Answered on {new Date(answer.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="answer-content">{answer.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;




