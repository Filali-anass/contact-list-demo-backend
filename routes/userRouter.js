import express from "express";
import bcrypt from "bcrypt";
const saltRounds = 10;

import User from "../model/User.js";
import jwt from "jsonwebtoken";
import { config } from "../auth/passport.js";
import passport from "passport";

const userRouter = express.Router();

userRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // when using the passport JWT strategy, passport will use the method to verify:
    // 1- the token
    // 2- set the user in req.user
    console.log(req.user);
    const users = await User.find({});

    res.send(users);
  }
);

userRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const userToCreate = new User({
    hashedPassword,
    email,
    name,
  });

  const userCreated = await userToCreate.save();

  const token = jwt.sign(
    { email, userId: userCreated._id },
    config.passport.secret,
    {
      expiresIn: 10000000,
    }
  );

  const userCreatedJSON = userCreated.toJSON();
  delete userCreatedJSON.hashedPassword;

  return res.json({
    message: "User register success",
    user: { ...userCreatedJSON, token },
  });
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {
      // Sign the JWT token with email and userId
      // UserId is needed to find which user is making the api call
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        config.passport.secret,
        {
          expiresIn: 10000000,
        }
      );

      const userJSON = user.toJSON();
      delete userJSON.hashedPassword;

      return res.json({
        message: "User login success",
        user: { ...userJSON, token },
      });
    } else {
      return res.status(401).json({
        message: "Password not match",
      });
    }
  } else {
    return res.status(401).json({
      message: "User not found",
    });
  }
});

export default userRouter;
