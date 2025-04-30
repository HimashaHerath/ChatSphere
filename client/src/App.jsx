import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import ChatsPage from "./ChatsPage";
import LandingPage from "./pages/LandingPage";

function App() {
  const [user, setUser] = useState(null);

  // Check for saved user data when the app loads
  useEffect(() => {
    const savedUser = localStorage.getItem("chatAppUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("chatAppUser");
      }
    }
  }, []);

  // Function to handle successful authentication
  const onAuth = (userData) => {
    setUser(userData);
    // Save user data to localStorage for persistence
    localStorage.setItem("chatAppUser", JSON.stringify(userData));
  };

  // Function to handle logout
  const onLogout = () => {
    setUser(null);
    localStorage.removeItem("chatAppUser");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/chats" /> : <AuthPage onAuth={onAuth} />} 
        />
        
        <Route 
          path="/chats" 
          element={user ? <ChatsPage user={user} onLogout={onLogout} /> : <Navigate to="/auth" />} 
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;