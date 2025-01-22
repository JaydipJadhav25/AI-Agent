import { blacklistToken } from "../model/blackListToken.model.js";
import { createUser , checkPasswordAndGenTokne } from "../services/user.service.js";
import {validationResult} from "express-validator"
// import redisClient from "../services/redis.service.js"
import { userModel } from "../model/user.model.js";



const userSignup = async(req , res) =>{

    const error = validationResult(req);


    console.log("error :" , error , "error array :" , !error.isEmpty());


    if(!error.isEmpty()){
      return res.status(401).json({ error : error.array()});
    }

    try {

        const {email , password} = req.body;

        console.log("email , password : " , email , password);

        const user = await createUser(email , password);
        console.log("user : " , user );


        return res.status(200).json({
            message : "User SingUp Successfully...........",
            user
        })
        
    } catch (error) {

        console.log("erro :", error.message);
        return res.status(401).json({ message : error.message});
        
    }

}

const userLogin = async(req , res) =>{

    const error = validationResult(req);


    console.log("error :" , error , "error array :" , !error.isEmpty());


    if(!error.isEmpty()){
      return res.status(401).json({ error : error.array()});
    }

    try {

        const{email  , password} = req.body;

        const token = await checkPasswordAndGenTokne(email , password);
        
        if(!token){
        return res.status(401).json({ message : "user token genrate Error"});
        }

        //send user 
        const user = await userModel.findOne({email : email});
        user.password = undefined;


        //set cookies
        return res
        .status(202)
        .cookie("token" , token)
        .json({
            message : "User login Sucessfully..",
            token,
            user
        });



        
    } catch (error) {
        console.log("error : " , error);
        return res.status(401).json({ message : error.message});
        
        
    }


}

const userLogOut = async(req, res) =>{

    const token = req.cookies.token || req.headers?.authorization?.split(' ')[1];

    //add blackListedtoken

    await blacklistToken.create({token});


    return res
    .status(200)
    .clearCookie("token")
    .json({
        message : "User logOut successully...."
    });




}


const userProfile = async(req , res) =>{

    return res.status(201).json(req.user);
}


export {userSignup , userLogin , userLogOut , userProfile}