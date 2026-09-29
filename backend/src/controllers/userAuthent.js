const redisClient = require('../config/redisClient');
const { findByIdAndDelete } = require('../models/problem');
const User =  require("../models/user")
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
//const redisClient = require("../config/redisClient")

const register = async (req,res)=>{

    try{
        validate(req.body);

        const {firstName, emailId, password}  = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        const user =  await User.create(req.body);
        const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000
});

         const reply = {
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }
        
       res.status(201).json({
    user: reply,
    message: "Registered Successfully"
});
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        console.log("========== LOGIN ATTEMPT ==========");
        console.log("Request Body:", req.body);

        if (!emailId || !password) {
            console.log("Missing emailId or password");
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        const user = await User.findOne({ emailId });

        console.log("User Found:", !!user);

        if (!user) {
            return res.status(401).json({
                message: "Invalid User"
            });
        }

        console.log("Stored Password Hash:", user.password);

        const match = await bcrypt.compare(password, user.password);

        console.log("Password Match:", match);

        if (!match) {
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                emailId: user.emailId,
                role: user.role
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        console.log("JWT Generated Successfully");

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000
        });

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
            role: user.role
        };

        console.log("Login Successful for:", emailId);

        return res.status(200).json({
            user: reply,
            message: "Logged in Successfully"
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);

        return res.status(500).json({
            message: err.message || "Internal Server Error"
        });
    }
};
// logOut feature
const logout = async(req,res)=>{

    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
    //    Token add kar dung Redis ke blockList
    //    Cookies ko clear kar dena.....

    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send("Logged Out Succesfully");

    }
    catch(err){
       res.status(503).send("Error: "+err);
    }
}
//admin can register admin only
const adminRegister = async(req,res)=>{
    try{
        // validate the data;
    //   if(req.result.role!='admin')
    //     throw new Error("Invalid Credentials");  
      validate(req.body); 
      const {firstName, emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    //
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("User Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const getProfile = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).send("Unauthorized: No token");
        }

        // Check if token is blacklisted (logout case)
        const blocked = await redisClient.get(`token:${token}`);
        if (blocked) {
            return res.status(401).send("Session expired. Please login again.");
        }

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        const user = await User.findById(_id).select("-password");

        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(401).send("Invalid Token");
    }
};

const deleteProfile = async(req,res)=>{
  
    try{
       const userId = req.result._id;
      
    // userSchema delete
    await User.findByIdAndDelete(userId);

    // Submission se bhi delete karo...
    
    // await Submission.deleteMany({userId});
    
    res.status(200).send("Deleted Successfully");

    }
    catch(err){
      
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {register,login,logout,adminRegister,getProfile,deleteProfile};
