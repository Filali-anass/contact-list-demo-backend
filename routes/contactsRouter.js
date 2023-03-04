import passport from "passport";
import express from "express";
import Contact from "../model/Contact.js";
import validate from "../middleware/zodValidation.js";
import { z } from "zod";
import mongoose from "mongoose";

const contactRouter = express.Router();

contactRouter.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const contacts = await Contact.find({
      userId: new mongoose.Types.ObjectId(req.user._id),
    });
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({
        message: "No contacts found",
      });
    } else {
      res.json({
        message: "contacts List Success",
        contacts,
      });
    }
  }
);

// create contact
contactRouter.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        name: z.string(),
        phone: z.string().min(9),
      }),
    })
  ),
  async (req, res) => {
    const { email, phone, name } = req.body;

    const contact = new Contact({
      email,
      phone,
      name,
      userId: req.user._id,
    });
    await contact.save();

    // status 201 is for creating new objects in the system
    return res.status(201).json({
      message: "Contact created successfully",
      contact,
    });
  }
);

contactRouter.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        name: z.string(),
        phone: z.string().min(9),
      }),
      params: z.object({
        id: z.string().length(24), // to validate it is a mongo Id
      }),
    })
  ),
  async (req, res) => {
    const { email, phone, name } = req.body;
    const { id } = req.params;

    const contactUpdated = await Contact.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          email,
          phone,
          name,
        },
      },
      { returnDocument: "after" }
    );

    res.status(200).json({
      message: "Contact updated successfully",
      contact: contactUpdated,
    });
  }
);

contactRouter.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validate(
    z.object({
      params: z.object({
        id: z.string().length(24), // to validate it is a mongo Id
      }),
    })
  ),
  async (req, res) => {
    const { id } = req.params;
    const deleted = await Contact.deleteOne({ _id: id });
    if (deleted) {
      return res.status(200).json({
        message: "Contact deleted successfully",
      });
    }
  }
);

export default contactRouter;
