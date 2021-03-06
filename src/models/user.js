const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error('Age must be greater than 0')
        }
      }
    },
    email: {
      type: String,
      required: true,

      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.length < 6) {
          throw new Error('Password must be greater than 6 characters');
        } else if (value.toLowerCase().includes('password')) {
          throw new Error('Password should not be equal to password');
        }
      }
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.generateAuthToken = async function () {
  // methods accessible on instances
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.tokens;
  delete userObject.password;
  delete userObject.avatar;
  return userObject;
}


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login'); // generalize error for logging in
  }

  return user;


}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
}
);


// Delete user tasks when the user is removed
userSchema.pre('remove', async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});

// 1. Define a model
const User = mongoose.model('users', userSchema); //

module.exports = User;