const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("Name is not valid");
  }
  // else if(firstName.length < 4  && firstName.length > 50){
  //     throw new Error("Firstname should be between 4-50 character");
  // }
  //above is commented because that is already validated in userSchema.
  else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong");
  }
};

const validateEditProfile = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "about",
    "age",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,validateEditProfile
};
