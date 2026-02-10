import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage=()=> {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMsg("Email and Password fields are required");
      return false;
    }

    if (!emailRegex.test(email)) {
      setMsg("Enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setMsg("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/rentPredictor");
    } catch {
      setMsg("Server error. Try again");
    }
  };

  const NavigateSignup = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen pb-40">  
      <div className="flex flex-col shadow-md items-center gap-15 justify-center w-120 h-100 rounded-xl bg-white/30 backdrop-blur-md border border-white/90">
        <div>
          <p className="font-bold text-2xl">Welcome!</p>
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <div className="mx-auto px-4 flex flex-col self-start justify-center gap-2 ">
              <label htmlFor="emailId" className="self-start font-bold">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                className="border rounded-sm h-9 bg-white border-gray-300 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="password" className="self-start font-bold">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="border rounded-sm h-9 bg-white border-gray-300 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {msg && <p className="text-center text-red-600 mt-2">{msg}</p>}
              <button className="w-96 p-2 bg-sky-500 hover:bg-sky-700 font-bold mt-3 text-white rounded-sm">
                Log In
              </button>
            </div>
          </form>
          <div className=" flex w-98 my-3 justify-end rounded-sm">
            <button className="text-sky-600 " onClick={NavigateSignup}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;