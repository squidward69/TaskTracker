import User from "../model/user.model.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateTokenAndSaveInCookies } from "../jwt/token.js";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  username: z
    .string()
    .min(3, { message: "username must be minimum 3 characters" })
    .max(20, { message: "username must be maximum 20 characters" }),
  password: z
    .string()
    .min(6, { message: "password must be minimum 6 characters" }),
});

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validation = userSchema.safeParse({ username, email, password });
    if (!validation.success) {
      const errorMessage = validation.error.errors.map((err) => err.message);
      return res.status(400).json({ errors: errorMessage });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists." });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashPassword });
    await newUser.save();

    if (newUser) {
      const token = await generateTokenAndSaveInCookies(newUser._id, res);
      // console.log("Token in register:", token) // debug log
      res
        .status(201)
        .json({ message: "User Registered Successfully", newUser, token });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Registering User" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = await generateTokenAndSaveInCookies(user._id, res);
    res.status(200).json({ message: "User Logged in Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Logging User" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      path: "/",
    });
    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Logging Out" });
  }
};
