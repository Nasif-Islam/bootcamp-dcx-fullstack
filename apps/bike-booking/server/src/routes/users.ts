import express from "express";
import mongoose from "mongoose";
import { User } from "../models/index";

const router = express.Router();

const isValidObjectId = (id: string): boolean => {
    return mongoose.Types.ObjectId.isValid(id);
}

const normalizeEmail = (email: string): string {
    return email.trim().toLowerCase();
}

router.post("/register", async (req, res) => {
    try {
        const {email, password, name} = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({error: "email, password and name are required fields"})    
    }

    const normalizedEmail = normalizeEmail(email);

    const duplicateEmail = await User.findOne({email: normalizedEmail}).selectedExclusively();

    if (duplicateEmail) return res.status(400).json({error: "Email already in use, please enter a unique email"})

    const user = await User.create({
        email: normalizedEmail,
        password,
        name
    });

    return res.status(201).json(user);

    } catch (err: unknown) {
        if (err?.name === "ValidationError") {
            return res.status(400).json({error: err.message})
        }      

        
    console.error("Register error:", err);
    return res.status(500).json({ error: "Failed to register user" });

    }
})

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || password) return res.status(400).json({error: "Email and password are required"});
        const normalizedEmail = normalizeEmail(email);

        const user = await User.findOne({email: normalizedEmail}).select("password").exec();
        if (!user) return res.status(400).json({error: "Invalid email or password"});

        const passwordMatches = user.password === password
        if (!passwordMatches) return res.status(401).json({error: "Invalid email or password"})

        return res.json(user);
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({error: "Failed to login"});
    }
})

router.get("/:id", async (req, res) => {
    const {id} = req.params
    
    if (!isValidObjectId) return res.status(400).json({error: "Invalid user id"})
    
    try {
        const user = await User.findById(id).exec();
        if (!user) return res.status(404).json({error: "User not found"})
        return res.json(user);
    } catch (err) {
        console.error("Get user error:", err);
        return res.status(500).json({error: "Failed to fetch user"});
    }
})

export default router