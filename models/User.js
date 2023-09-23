const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(this.password, salt);
  this.password = hash;

  return next();
});

// Compare the password against the user in the database
userSchema.methods.matchPassword = function (password) {
  return bcryptjs.compareSync(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
