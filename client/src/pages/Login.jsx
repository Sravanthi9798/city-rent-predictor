import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg("Login Successful!");
      console.log("TOKEN ->", data.token);
      console.log("res", data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/rentPredictor");
    } else {
      setMsg(data.message);
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
                Email
              </label>
              <input
                type="text"
                name="email"
                placeholder="Enter your email"
                className="border rounded-sm h-9 bg-white border-gray-300 p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="password" className="self-start font-bold">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="border rounded-sm h-9 bg-white border-gray-300 p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="w-96 p-2 bg-sky-500 hover:bg-sky-700 font-bold mt-3 text-white rounded-sm">
                Log In
              </button>
            </div>
          </form>
          {msg && <p className="text-center text-red-600 mt-2">{msg}</p>}
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
