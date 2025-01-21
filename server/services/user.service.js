import {userModel} from "../model/user.model.js"




export const createUser = async(email , password) =>{
    

    if(!email || !password){
        throw new Error("All field required!");
    }
   


    const checkEmail = await userModel.findOne({email: email});

    if(checkEmail){
        throw new Error("Email already exits");
    }


    //hash password
    const hashPassword = await userModel.hashpassword(password);
    console.log(" hashpassowd " , hashPassword);



    const user = await userModel.create({
        email : email,
        password : hashPassword
    })

    console.log("usr  " , user);


    return user


}


