import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage= async (req, res) => {
    // console.log("message sent",req.params.id);
    try {
        const {message} =req.body;
        const {id:receiverId} =req.params;
        const senderId=req.user._id;

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })
        
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId]
            })
        }
        const newMessage=await Message.create({
            senderId:senderId,
            receiverId:receiverId,
            message: message
        })

        if(newMessage){
            conversation.message.push(newMessage._id);
        }
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(),newMessage.save()]);
        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sending message",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
};

export const getMessage= async (req, res) => {
    try {
        const {id:userToChatId}=req.params;
        const senderId =req.user._id;

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,userToChatId]}
        }).populate("message");

        if(!conversation){
            return res.status(200).json([]);
        }

        const messages=conversation.message;

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages controller message",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}