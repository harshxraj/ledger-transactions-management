import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast, ToastBar, Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [user, setUser] = useState({
    email: "test@gmail.com",
    password: "123456",
  });
  const navigate = useNavigate();
  const apiUrl = "https://ledger-transactions-management-1.onrender.com";
  const { setAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!user.email) {
      return toast.error("Enter email!");
    }

    if (!user.password) {
      return toast.error("Enter password!");
    }

    try {
      const res = await axios.post(`${apiUrl}/auth/login`, user);
      console.log(res.data);

      // Save the auth data to local storage
      localStorage.setItem("auth", JSON.stringify(res.data));

      // Set the auth state
      setAuth(res.data);

      // Navigate to the homepage
      navigate("/");
    } catch (error) {
      console.log("Error ->", error.response?.data?.error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  return (
    <div className="bg-gradient-to-bl from-white via-[#bfcfff] to-[#9d9bff] h-screen w-full flex items-center justify-center">
      <Toaster />
      <div className="flex justify-center items-center">
        <form className="flex flex-col gap-3 w-[400px] border-2 rounded-lg border-black/45 p-6 text-black bg-[#9d9bff]">
          <h1 className="text-4xl font-semibold text-slate-900  text-center">Login</h1>

          <label className="bg-gray-800 w-20 rounded-lg text-center text-white px-2">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="p-2 text-black rounded-md"
            value={user.email}
            onChange={handleChange}
            name="email"
          />
          <label className="bg-gray-800 w-24 rounded-lg text-center text-white px-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="p-2 border-blue-500 rounded-md"
            value={user.password}
            onChange={handleChange}
            name="password"
          />

          <button
            type="submit"
            onClick={handleLogin}
            className="m-auto px-6 py-2 font-medium bg-gray-800 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            Login
          </button>
          <div className="flex justify-end items-center">
            Need a new account?{" "}
            <Link to="/register">
              <span className="bg-yellow-300 px-3 py-1 rounded-lg ml-4">Register</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
