import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, match: [/.+\@.+\../, "Please enter a valid email"] },
  password: {
    type: String,
    validate: {
      validator: function (value) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,12}$/.test(value)
      },
      message:"Password should be between 8-12 characters and have at least one letter, one number and one special character"
    }

  },
  type: { type: String, enum: ['Customer', 'Seller'] }
})