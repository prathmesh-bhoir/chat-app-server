import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { response } from "express";

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

        const user = await User.create({email,password});
        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure: true,
            sameSite: "None"
        });
        return res.status(200).json({
            user:{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
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

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).send("User does not exist!")
        }

        const isPasswordCrt = await bcrypt.compare( password, user.password )
        if(!isPasswordCrt){
            return res.status(400).json({message: "Invalid Password!"})
        }

        res.cookie("jwt",createToken(email,user.id),{
            maxAge,
            secure: true,
            sameSite: "None"
        });

        return res.status(200).json({
            user:{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.laststName,
                image: user.image,
                color: user.color

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
                lastName: user.laststName,
                image: user.image,
                color: user.color
        })
    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}