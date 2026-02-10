const { register, login } = require("../controllers/authController");
const User = require("../models/authModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock User model
jest.mock("../models/authModel");

// Mock bcrypt
jest.mock("bcrypt");

// Mock jwt
jest.mock("jsonwebtoken");

// REGISTER TESTS

describe("Auth Controller - Register", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if name is missing", async () => {
    req.body = {
      email: "test@example.com",
      password: "Test@1234",
      confirmpassword: "Test@1234"
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Name is required"
    });
  });

  test("should return 409 if email already exists", async () => {
    req.body = {
      name: "John",
      email: "test@example.com",
      password: "Test@1234",
      confirmpassword: "Test@1234"
    };

    // Mock existing user
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    await register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email already registered"
    });
  });

  test("should create user successfully", async () => {
    req.body = {
      name: "John",
      email: "test@example.com",
      password: "Test@1234",
      confirmpassword: "Test@1234"
    };

    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword");
    User.create.mockResolvedValue({
      _id: "123",
      name: "John",
      email: "test@example.com"
    });

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith("Test@1234", 10);
    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User created successfully",
      user: {
        id: "123",
        name: "John",
        email: "test@example.com"
      }
    });
  });
});


//LOGIN TESTS
describe("Auth Controller - Login", () => {
  let req, res;
  beforeEach(() => {
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 404 if user not found", async () => {
    req.body = {
      email: "test@example.com",
      password: "Test@1234"
    };

    User.findOne.mockResolvedValue(null);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found"
    });
  });

  test("should return 401 for invalid password", async () => {
    req.body = {
      email: "test@example.com",
      password: "wrongPassword"
    };
    User.findOne.mockResolvedValue({
      email: "test@example.com",
      password: "hashedPassword"
    });
    bcrypt.compare.mockResolvedValue(false);
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid credentials: Password didn't match"
    });
  });

  test("should login successfully", async () => {
    req.body = {
      email: "test@example.com",
      password: "Test@1234"
    };

    User.findOne.mockResolvedValue({
      _id: "123",
      name: "John",
      email: "test@example.com",
      password: "hashedPassword"
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fakeToken");

    await login(req, res);

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      token: "fakeToken",
      user: {
        id: "123",
        name: "John",
        email: "test@example.com"
      },
      message: "Login successfully"
    });
  });
});
