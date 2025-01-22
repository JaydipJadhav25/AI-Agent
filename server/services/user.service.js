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

export const checkPasswordAndGenTokne = async(email , password) =>{

    if(!email || !password){
        throw new Error("All field required!");
    }
   


    const  user = await userModel.findOne({email: email});

    if(!user){
        throw new Error("Email Is Not existing........");
    }

    //check password

    const isPasswordCorrect = await user.isvalidePassword(password);

        if(!isPasswordCorrect){
            throw new Error("Password is Wrong");
        }

        //gen token 

        const token = user.genrateJwt()

        return token;


}

export const allUsers = async(userId)=>{

    if(!userId){
        throw new Error("UserId is required!")
    }


    // const allUsers = await userModel.findOne()
    const allUsers = await userModel.find({ _id: { $ne: userId } });

    return allUsers;

}
