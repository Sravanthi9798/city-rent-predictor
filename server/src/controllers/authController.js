const bcrypt = require("bcrypt");
const User = require("../models/authModel");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

//Regex rules
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

const register = async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    // Checks whether the name field is missing or empty
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }
    // Ensures the email field is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    // Ensures the password field is provided
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // Ensures the confirm password field is provided
    if (!confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm password is required",
      });
    }
    // Validate email format using regex
    // Prevents invalid email patterns from being stored

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    // Validate password strength using regex
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number and special character",
      });
    }
    // Check if password and confirm password match
    if (password !== confirmpassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    // Check if a user with the same email already exists. Prevents duplicate user registration
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash the password before saving to database. Plain text passwords are NEVER stored for security reasons
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user document in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // Send success response (excluding password)
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Handles unexpected server or database errors
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    // Extract email and password from request body
    const { email, password } = req.body;

    // Validate required login fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    // Find user by email
    // If user does not exist, login is rejected
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare entered password with hashed password from database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // Generate JWT token for authenticated user
    // Token contains user ID and expires in 1 day
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send success response with token and user details
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Login successfully",
    });
  } catch (error) {
    // Handle unexpected login errors
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { register, login };
