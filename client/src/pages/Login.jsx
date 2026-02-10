import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setApiError("");

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/rentPredictor");
    } catch {
      setApiError("Server error. Try again");
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
              <label className="self-start font-bold">
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
              {errors.email && (
                <p className="text-red-600 text-sm text-left">{errors.email}</p>
              )}
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
              {errors.password && (
                <p className="text-red-600 text-sm text-left">
                  {errors.password}
                </p>
              )}
              {apiError && (
                <p className="text-center text-red-600 mt-2">{apiError}</p>
              )}
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
};
export default LoginPage;
