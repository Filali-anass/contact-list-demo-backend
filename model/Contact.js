import mongoose from "mongoose";

const schema = new mongoose.Schema({
  email: {
    required: true,
    type: "string",
  },
  phone: {
    required: true,
    type: "string",
  },
  name: { required: true, type: "string" },
  userId: mongoose.Types.ObjectId,
});

const Contact = mongoose.model("Contact", schema);

export default Contact;
