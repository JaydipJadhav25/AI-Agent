import jwt from "jsonwebtoken";
import {blacklistToken} from "../model/blackListToken.model.js"
import { userModel } from "../model/user.model.js";


export  const authUser = async(req, res , next) =>{
    const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];

    if(!token) {
        return res.json({
            message : "Unauthorized"
        })
    }

    //check token is blacklisted or not
    const isBlacklisted = await blacklistToken.findOne({token});

    if(isBlacklisted) {
        return res.json({
            message : "Token is blacklisted"
        })
    };


    try {
        
        const decodetoken = jwt.verify(token , process.env.JWT_SCERET);
        
        const user = await userModel.findById(decodetoken._id);
        if(!user) {
            return res.json({
                message : "Unauthorize user i not found"
            })
        }

        //set user

        user.password = undefined;
        req.user = user;
        next();


    } catch (error) {
        console.log("error : " , error);

        return res.json({ 
            message : "Authuser error Unauthorize"
        })
        .status(401)
        
    }finally{


    }

}



