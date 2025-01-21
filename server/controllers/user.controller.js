import { createUser } from "../services/user.service.js";
import {validationResult} from "express-validator"




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




export {userSignup}