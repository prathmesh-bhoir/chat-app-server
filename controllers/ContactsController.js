import mongoose, { mongo } from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContacts = async(req, res, next) => {
    try {
        const {searchTerm} = req.body;

        if(searchTerm === undefined || searchTerm === null){
            return res.status(400).send("Search term is required.")
        }

        const sanitizedSearchTerm = searchTerm.replace(
            /[^a-zA-Z0-9]/g, ''
        );

        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                {_id: { $ne: req.userId}},
                {
                    $or: [{firstName: regex}, {lastName: regex}, {email: regex}]
                }
            ]
        })

        return res.status(200).json({contacts})

    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}

export const getContactsForDMList = async(req, res, next) => {
    try {
        let {userId} = req;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
             $match:{
               $or: [{sender: userId}, {reciever: userId}],             
                },
            },
            {
             $sort: { timestamp: -1},
            },
            {
                $group:{
                    _id:{
                       $cond:{
                        if:{$eq:["$sender", userId]},
                        then: "$reciever",
                        else: "$sender"
                     }, 
                    },
                    lastMessageTime: { $first: "$timestamp"}                 
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            } ,
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: {lastMessageTime: -1}
            }      
        ]);

        return res.status(200).json({contacts})

    } catch (error) {
        console.log({error})
        return res.status(500).send("Internal Server Error");
    }
}