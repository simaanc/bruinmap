import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        { email, password }
      );
      setUser(response.data.user);
      navigate("/");
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
      await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
      });
      alert("Password reset email sent!");
    } catch (err) {
      setError(err.response.data.message);
      console.error(
        "Error sending password reset email: ",
        err.response.data.message
      );
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signin`,
        { email, password }
      );
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Set the default Authorization header for all requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
        setUser(response.data.user);
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/signout`);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
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
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isLoggedIn = !!user;
  const value = {
    user,
    isLoggedIn,
    signIn,
    logout,
    loading,
    error,
    createUser,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
