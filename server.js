import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import userRouter from "./routes/userRouter.js";
import contactsRouter from "./routes/contactsRouter.js";
import applyPassportStrategy from "./auth/passport.js";

dotenv.config();

const app = express();

app.use(cors());

// Apply strategy to passport
applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/contacts", contactsRouter);

app.listen(process.env.PORT || 3000, async () => {
  console.log("Server Started at port 3000");

  await mongoose.connect(process.env.MONGO_URI);

  console.log("DataBase connected to:", process.env.MONGO_URI);

  //   const user = new User({
  //     email: "anass@gmail.com",
  //     password: "1234567",
  //   });

  //   user.save();
});

// gomycodenodejs : gomycodenode600
// gomycodenodejs:vqwOvMngNLPc6yAn
