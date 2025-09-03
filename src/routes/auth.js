const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const User = require("../models/user");
const { sendOtp, verifyOtp } = require("../controllers/authController.js");






authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);


// ================== SIGNUP ==================
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate input before DB call
    validateSignUpData(req);

    const { emailId, firstName, lastName, password, gender, age, skills } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      skills,
    });
    const savedUser = await user.save();

    // Generate JWT
    const token = await user.getJWT();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    // Hide password before sending response
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User added successfully",
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ================== LOGIN ==================
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Find user
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = await user.getJWT();

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
    });

    // Hide password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: "Login successful",
      user: userResponse,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Email is not Valid");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
         const token = await user.getJWT();

        res.cookie("token", token , {
            expires : new Date(Date.now() + 8 * 60 * 60 * 60 ) 
        } );
        // res.send("Login Successfull");
        res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    console.error("Error"+err.message);
    res.status(400).send("Error:" + err.message);
  }
});


authRouter.post("/logout" , async (req,res) =>{
    res.cookie("token" , null ,{
        expires : new Date(Date.now())
    });
    res.send("Logout Succesfully");
})


module.exports = authRouter;