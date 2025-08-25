import { generateToken } from "../lib/utils.js";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Signup a new user
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;
  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);
    const userSafe = newUser.toObject();
    delete userSafe.password;

    res.json({
      success: true,
      userData: userSafe,
      token,
      message: "Account Created Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(userData._id);
    const userSafe = userData.toObject();
    delete userSafe.password;

    res.json({
      success: true,
      userData: userSafe,
      token,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check auth
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    const update = { bio, fullName };
    if (profilePic) {
      // supports data URI like data:image/png;base64,xxxx
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "chatapp/profilePics",
      });
      update.profilePic = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
