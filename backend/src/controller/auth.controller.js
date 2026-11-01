import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/jwt.js";

// ----------------------Signup-----------------------------------

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (user) {
      return res
        .status(400)
        .json({ msg: "An account already exists with this email. Please sign in." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        provider: "local",
      },
    });

    if (newUser) {
      // Generate JWT Token
      const token = generateToken(newUser.id, res);

      return res.status(200).json({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        subscriptionPlan: newUser.subscriptionPlan || "free",
        token: token,
      });
    }
  } catch (error) {
    console.error("Error in Signup:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// -------------------------Login-----------------------------

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    // OAuth-only users don't have a password — tell them to use their provider
    if (!user.password) {
      return res.status(400).json({
        msg: `This account uses ${user.provider} login. Please sign in with ${user.provider}.`,
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "Invalid email or password." });
    }

    const loginToken = generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      subscriptionPlan: user.subscriptionPlan || "free",
      token: loginToken,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//-----------------------------Logout------------------------

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ msg: "Logged out succesfully." });
  } catch (error) {
    console.error("Error in logout:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// -------------------------UpdateProfile________________
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName } = req.body;

    if (!fullName) {
      return res.status(401).json({ msg: "Name is required." });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName: fullName,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
