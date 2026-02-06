import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const { name, email, password, confirmpassword } = data;
    if (!name || !email || !password || !confirmpassword) {
      alert("all field are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("invalid email address");
      return false;
    }
    if (password.length <= "6") {
      alert("length of the password is less than 6");
      return false;
    }
    if (confirmpassword !== password) {
      alert("Password and Confirm Password should be same");
      return false;
    }
    return true;
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
            Name
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="name"
            type="text"
            onChange={handleChange}
            value={data.name}
            placeholder="Enter Your name"
            required
          />
          <label className="flex font-semibold item-start my-1 text-black">
            Email
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="email"
            type="text"
            onChange={handleChange}
            value={data.email}
            placeholder="Enter your email"
            required
          />
          <label className="flex font-semibold item-start my-1  text-black">
            Password
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="password"
            type="password"
            onChange={handleChange}
            value={data.password}
            placeholder="Enter your password"
            required
          />
          <label className="flex font-semibold item-start my-1  text-black">
            Confirm Password
          </label>
          <input
            className="border rounded-sm h-9 bg-white border-gray-300 p-2"
            name="confirmpassword"
            type="password"
            onChange={handleChange}
            value={data.confirmpassword}
            placeholder="Confirm your password"
            required
          />
          <button
            className= "bg-sky-500 hover:bg-sky-700font-semibold cursor-pointer rounded-sm  mt-5 h-8 text-white"
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
