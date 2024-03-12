import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
      console.error("Error creating user: ", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email });
      alert('Password reset email sent!');
    } catch (err) {
      setError(err.response.data.message);
      console.error("Error sending password reset email: ", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
      console.log(err.response.data.message);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/signout');
      setUser(null);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
      console.error("Error signing out: ", err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me');
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = !!user;
  const value = { user, isLoggedIn, signIn, logout, loading, error, createUser, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);