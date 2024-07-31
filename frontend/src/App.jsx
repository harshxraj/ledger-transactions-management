import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function App() {
  const { auth } = useAuth();
  const [userAuth, setUserAuth] = useState(null);
  const ls = JSON.parse(localStorage.getItem("auth"));

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    setUserAuth(storedAuth);
  }, [auth]); 

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/register" element={userAuth || ls?.token ? <Navigate to="/" /> : <Register />} />
        <Route path="/login" element={userAuth || ls?.token ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={userAuth || ls?.token ? <Homepage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
