import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;

  const validate = () => {
    const newErrors = {};
    const { name, email, password, confirmpassword } = data;

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must contain 8+ characters, uppercase, lowercase, number & special character";
    }

    if (!confirmpassword) {
      newErrors.confirmpassword = "Confirm password is required";
    } else if (password !== confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const navigateLoginPage = () => {
    navigate("/");
  };
  const registerPage = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(data);
      if (response.ok) {
        alert("User Registered Succesfully");
        setData({
          name: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        navigateLoginPage();
      } else {
        const err = await response.json();
        alert(err.message);
      }
    } catch (err) {
      console.log(err, "Try again");
    }
  };
  return (
    <div className="w-full font-sans-serif  flex justify-center">
      <div className="container justify-center shadow-md rounded-sm  h-150 mt-15 item-center w-120 p-3 bg-white/20 backdrop-blur-md border border-white/30">
        <div className=" flex justify-center">
          <h2 className="font-semibold  text-xl text-black">Sign Up!</h2>
        </div>
        <form className="flex p-5 flex-col">
          <label className="flex font-semibold item-start my-1 text-black">
            Name<span className="text-red-500">*</span>
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="name"
            type="text"
            onChange={handleChange}
            value={data.name}
            placeholder="Enter Your name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm text-left">{errors.name}</p>
          )}
          <label className="flex font-semibold item-start my-1 text-black">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="email"
            type="text"
            onChange={handleChange}
            value={data.email}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-600 text-sm text-left">{errors.email}</p>
          )}

          <label className="flex font-semibold item-start my-1  text-black">
            Password<span className="text-red-500">*</span>
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="password"
            type="password"
            onChange={handleChange}
            value={data.password}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-600 text-sm text-left">{errors.password}</p>
          )}
          <label className="flex font-semibold item-start my-1  text-black">
            Confirm Password<span className="text-red-500">*</span>
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="confirmpassword"
            type="password"
            onChange={handleChange}
            value={data.confirmpassword}
            placeholder="Confirm your password"
          />
          {errors.confirmpassword && (
            <p className="text-red-600 text-sm text-left">
              {errors.confirmpassword}
            </p>
          )}
          <button
            className="bg-sky-500 hover:bg-sky-700font-semibold cursor-pointer rounded-sm  mt-5 h-8 text-white"
            type="submit"
            onClick={registerPage}
          >
            Sign Up
          </button>
        </form>
        <div className="flex p-3 flex-row justify-start">
          <label
            className="text-sky-700 "
            onClick={() => {
              navigate("/");
            }}
          >
            Already have an account?
          </label>
          <div className="ml-45"></div>
          <button
            className="text-sky-700 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};
export default Register;
