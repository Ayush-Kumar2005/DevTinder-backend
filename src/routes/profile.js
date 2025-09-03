const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { userAuth } = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
const profileRouter = express.Router();

// profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => { 
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;
    // console.log("Before"+loggedInUser);
    Object.keys(req.body).forEach((key)=> (loggedInUser[key] = req.body[key]) );
    // console.log("After"+loggedInUser);
    await loggedInUser.save();
    // res.send(`${loggedInUser.firstName}, your profile updated successfully`);
    res.json({message : `${loggedInUser.firstName}, your profile updated successfully` ,
        data : loggedInUser
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new password are required");
    }

    // 1. Verify old password
    const isMatch = await loggedInUser.validatePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // 2. Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong enough");
    }

    // 3. Hash new password
    const saltRounds = 10;
    loggedInUser.password = await bcrypt.hash(newPassword, saltRounds);

    // 4. Save updated user
    await loggedInUser.save();

    res.send("Your password was updated successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


module.exports = profileRouter;
