const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index : true ,  
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address :" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password :" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 50,
    },
    gender: {
      type: String,
      enum : {
        values : ["male" , "female" , "other"],
        message : `{VALUE} is not a valid gender type`
      },
      //by default validate function works only with new create data. If we will update(PATCH) then it will not work .
      //We have to enable it to run on PATCH Also.
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender  not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/366-3664582_bob-bob-dummy-image-of-user-hd-png.png",

      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL :" + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default description of user",
    },
    skills: {
      type: [String],
    },
    isVerified: { type: Boolean, default: false },
  },

  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Ayush@123", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
