import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import {renameSync, unlinkSync} from "fs"

const maxAge = 3*24*60*60*1000

const createToken = (email, userId) =>{
    return jwt.sign({email,userId}, process.env.JWTKEY, {expiresIn: maxAge})
}

export const signup = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).send("Email and Password is required.")
        }

        const existinguser = await User.findOne({ email });
        if(existinguser){
            return res.status(404).send("User already exist!")
        }

        const userData = await User.create({email,password});
        res.cookie("jwt",createToken(email,userData.id),{
            maxAge,
            secure: true,
            sameSite: "None"
        });
        return res.status(200).json({
            user:{
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup
            }
        })
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const login = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).send("Email and Password is required.")
        }

        const userData = await User.findOne({ email });
        if(!userData){
            return res.status(404).send("User does not exist!")
        }

        const isPasswordCrt = await bcrypt.compare( password, userData.password )
        if(!isPasswordCrt){
            return res.status(400).json({message: "Invalid Password!"})
        }

        res.cookie("jwt",createToken(email,userData.id),{
            maxAge,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json({
            user:{
                id: userData.id,
                email: userData.email,
                profileSetup: userData.profileSetup,
                firstName: userData.firstName,
                lastName: userData.lastName,
                image: userData.image,
                color: userData.color
            }
        })
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const getUser = async(req, res, next) => {
    try {
        
        const user = await User.findById(req.userId);
        if(!user){
            return res.status(404).send("User not found.")
        }

        return res.status(200).json({
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
        })
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const updateProfile = async(req, res, next) => {
    try {
        const {userId} = req;
        const {firstName , lastName , color} = req.body;

        if(!firstName || !lastName || color<0){
            return res.status(400).send("Firstname, lastname and color is required.")
        }
        const user = await User.findByIdAndUpdate(userId,{
            firstName,
            lastName,
            color,
            profileSetup: true
        },{ new:true, runValidators: true});

        return res.status(200).json({
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
        })
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const addProfileImage = async(req, res, next) => {
    try {
        if(!req.file){
            return res.status(400).send("File is required.")
        }

        const date = Date.now();
        let fileName = "upload/profiles/" + date  + req.file.originalname;
        renameSync(req.file.path,fileName);


        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {image: fileName},
            { new:true, runValidators: true}
        );

        return res.status(200).json({
                image: updatedUser.image,
        })
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const deleteProfileImage = async(req, res, next) => {
    try {
        const {userId} = req;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).send("User not found.")
        }

        if(user.image){
            unlinkSync(user.image)
        }
        user.image = null;

        await user.save();

        return res.status(200).send("Profile image removed successfully")
        
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const logOut = async(req, res, next) => {
    try {
       res.cookie("jwt","",{maxAge:1,secure:true, sameSite:"None"})
        return res.status(200).send("Logout successful")

    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}