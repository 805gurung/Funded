const mongoose = require('mongoose');
const saltrounds = 10;
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { error } = require('console')
const jwt = require('jsonwebtoken')
const {expressjwt} = require('express-jwt')
const sendEmail = require('../middleware/emailSender');
const Token = require('../models/TokenModel');

const User = require('../models/UserModel')

exports.register = async (req, res) => {
    const { name, email, password} = req.body;

    // Check if email is taken
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(saltrounds);
    const hashed_password = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
        name,
        email,
        password: hashed_password,

    });

    if (!user) {
        return res.status(400).json({ error: "Something went wrong" });
    }

    // Create token
    const token = await Token.create({
        user: user._id,
        userType: user.role,
        token: crypto.randomBytes(24).toString("hex")
    });

    if (!token) {
        return res.status(400).json({ error: "Something went wrong" });
    }

const URL = `http://localhost:5000/verifyuser/${token.token}`;


    sendEmail({
        from: "noreply@something.com",
        to: req.body.email,
        subject: "Verification Email",
        text: "Click on the following link to activate " + URL,
        html: `<a href='${URL}'><button>Verify Email</button></a>`
    });

    res.send({ user, message: "User registered successfully." });
};


exports.verifyEmail = async (req, res) => {
  console.log("Verification token received:", req.params.token);
  
  try {
    const tokenDoc = await Token.findOne({ token: req.params.token });
    console.log("Token found:", tokenDoc);

    if (!tokenDoc) {
      return res.status(400).json({ error: "Token not found" });
    }

    const user = await User.findById(tokenDoc.user);
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    user.isVerified = true;
    await user.save();
    await Token.deleteOne({ _id: tokenDoc._id });

    res.json({ message: "User verified successfully" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.login = async(req, res)=>{
    let {email, password}= req.body
    let user = await User.findOne({email})
    
    if(!user){
        return res.status(400).json({error:"Email not regsitered"})
    }
    let passwordCorrect = await bcrypt.compare(password, user.password)
    if(!passwordCorrect){
        return res.status(400).json({error:"Password incorrect"})
    }
    let{_id, name} = user
let token = jwt.sign({
        _id, name
    }, process.env.JWT_SECRET) 

 res.cookie('myCookie', token, {expire: Date.now() + 86400})
 res.send({
    token, user:{_id, email, name}
 })
 }

 exports.logOut = (req,  res)=>{
    res.clearCookie('myCookie')
    res.send({message:"Signed out successfully"})
}




