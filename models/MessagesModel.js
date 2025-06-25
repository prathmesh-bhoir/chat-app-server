import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false
    },
    messageType: {
        type: String,
        enum: ["text","file"],
        required: true
    },
    content:{
        type:String,
        required: function(){
            return this.messageType === "text";
        }
    },
    // fileUrl:{

    // }
    timeStamp: {
        type: Date,
        default: Date.now
    },
});

const Message = mongoose.model("Messages", messagesSchema);

export default Message;