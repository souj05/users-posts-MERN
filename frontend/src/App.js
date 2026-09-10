import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./header/Header";
import PostList from "./posts/PostList";
import PostCreate from "./posts/PostCreate";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { getAuthData, clearAuthData } from "./auth/auth.service";

function App() {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  // log the user back in after a page refresh, if the token is still valid
  useEffect(() => {
    const authData = getAuthData();
    if (!authData) {
      return;
    }

    const expiresIn = authData.expirationDate.getTime() - new Date().getTime();
    if (expiresIn > 0) {
      setUserIsAuthenticated(true);
      setUserId(authData.userId);
    } else {
      clearAuthData();
    }
  }, []);

  // the token only lasts 1 hour, so log out automatically when it runs out
  useEffect(() => {
    if (!userIsAuthenticated) {
      return;
    }

    const authData = getAuthData();
    if (!authData) {
      return;
    }

    const expiresIn = authData.expirationDate.getTime() - new Date().getTime();
    const timer = setTimeout(() => {
      clearAuthData();
      setUserIsAuthenticated(false);
      setUserId(null);
    }, expiresIn);

    return () => clearTimeout(timer);
  }, [userIsAuthenticated]);

  function onLoggedIn(data) {
    setUserIsAuthenticated(true);
    setUserId(data.userId);
  }

  function onLogout() {
    clearAuthData();
    setUserIsAuthenticated(false);
    setUserId(null);
  }

  return (
    <div>
      <Header userIsAuthenticated={userIsAuthenticated} onLogout={onLogout} />

      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <PostList userIsAuthenticated={userIsAuthenticated} userId={userId} />
            }
          />

          {/* these two were behind the AuthGuard in the Angular version */}
          <Route
            path="/create"
            element={userIsAuthenticated ? <PostCreate /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit/:postId"
            element={userIsAuthenticated ? <PostCreate /> : <Navigate to="/login" />}
          />

          <Route path="/login" element={<Login onLoggedIn={onLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
