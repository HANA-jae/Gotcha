import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, UserFormData } from '../types';

function UserDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<User>(`/users/${id}`);
      setUser(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        password: ''
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch user.');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.put<User>(`/users/${id}`, formData);
      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update user.');
      console.error('Error updating user:', err);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${id}`);
        navigate('/');
      } catch (err) {
        setError('Failed to delete user.');
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading user...</div>;
  }

  if (!user) {
    return (
      <div className="card">
        <p>User not found. <Link to="/">Back to users</Link></p>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="button button-secondary" style={{ marginBottom: '1rem' }}>
        ← Back to Users
      </Link>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h1>User Details</h1>

        {!isEditing ? (
          <div>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
              <button
                className="button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
              <button
                className="button button-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Password (leave empty to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="button">
                Save
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserDetail;
