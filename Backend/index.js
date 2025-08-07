import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import taskRoute from "./routes/task.route.js";
import userRoute from "./routes/user.route.js";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./model/user.model.js";
import { generateTokenAndSaveInCookies } from "./jwt/token.js";
import { authenticate } from "./middleware/authorize.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4002;
const DB_URI = process.env.MONGODB_URI;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ['set-cookie']
  })
);

app.use(passport.initialize());

//Database Connection Code
try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

//Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          //create new user if not exists
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            password: "", //No password for Google users
          });
          await user.save();
        }
        done(null, user); // pass user to serialize
      } catch (error) {
        done(error, null);
      }
    }
  )
);

//routes
app.use("/task", taskRoute);
app.use("/user", userRoute);

//Google Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      // Generate JWT token for the user
      const token = await generateTokenAndSaveInCookies(req.user._id, res);
      // console.log("Generated token:",token); 
      // Redirect to a dedicated route that handles token storage
      res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
    } catch (error) {
      // console.log("Token error:",error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

// Logout route
app.get("/auth/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect(`${process.env.FRONTEND_URL}/login`);
});

app.get("/protected-route", authenticate, (req, res) => {
  res.json(req.user); // User is attached by JWT
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
