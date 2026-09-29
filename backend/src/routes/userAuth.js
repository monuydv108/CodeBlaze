const express = require('express');
const {register,login,logout,adminRegister,getProfile,deleteProfile} = require("../controllers/userAuthent")
const userMiddleware = require('../middleware/userAuthentication');
const adminMiddleware = require('../middleware/adminAuthentication');
const authRouter =  express.Router();

// Register
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
authRouter.get('/getProfile',getProfile);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
authRouter.get('/check',userMiddleware, async (req,res)=>{

    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})
// login
// logout
// GetProfile
module.exports = authRouter;

