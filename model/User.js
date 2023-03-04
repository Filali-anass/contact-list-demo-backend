import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    required: true,
    type: "string",
  },
  email: {
    required: true,
    type: "string",
  },
  hashedPassword: {
    required: true,
    type: "string",
  },
});

const User = mongoose.model("User", schema);

export default User;
