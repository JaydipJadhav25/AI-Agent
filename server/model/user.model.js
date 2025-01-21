import  mongoose  from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    email :{
        type : "String",
        requried : true
    },
    password : {
        type : "String",
        requried : true 
    }
})



userSchema.statics.hashpassword = async function(password){
    return  await bcrypt.hash(password , 10);
}


userSchema.methods.isvalidePassword = async function(password) {

    return await bcrypt.compare(password , this.password);

}

userSchema.methods.genrateJwt = async function(){
    const token = jwt.sign({
      _id : this._id,
      email : this._id  
    }  , process.env.JWT_KET);

    return token
}


export const userModel = mongoose.model("user" , userSchema);
