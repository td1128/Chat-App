import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/generateToken.js";



export const signup= async(req, res) => {
    try{
        const {fullName,userName,password,confirmPassword,gender} = req.body;
        if(password!=confirmPassword){
            return res.status(400).json({error:"Password does not match"})
        }
        const user =await User.findOne({userName});
        if(user){
            return res.status(400).json({error:"User already exists"})
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword);

        // Create new user
        const boyProfilePic=`https://avatar.iran.liara.run/public/boy?userName=${userName}`
        const girlProfilePic=`https://avatar.iran.liara.run/public/girl?userName=${userName}`

        const newUser = new User({
            fullName,
            userName,
            password:hashedPassword,
            gender,
            profilePic:gender==="male" ? boyProfilePic : girlProfilePic
        })
        if (newUser){
            // Generate JWT token
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                userName:newUser.userName,
                gender:newUser.gender,
                profilePic:newUser.profilePic
            });

        }else{
            res.status(400).json({error:"Invalid user data"});
        }
    }
    catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({error:"Internal server error"})
    }
};

export const login= async (req, res) => {
    try {
        const {userName,password} = req.body;
        const user = await User.findOne({userName:userName});
        const isCorrectPassword =await bcrypt.compare(password,user?.password || "");
        if(!user || !isCorrectPassword){
            return res.status(400).json({error:'Invalid userName or password'});
        }
        generateTokenAndSetCookie(user._id,res);
        console.log("hello");
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            userName:user.userName,
            gender:user.gender,
            profilePic:user.profilePic
        })
    } 
    catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export const logout= (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Successfully logged out"});
    } catch (error) {
        console.log("Error in login controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};