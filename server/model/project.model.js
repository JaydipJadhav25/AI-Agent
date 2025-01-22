import mongoose from "mongoose";



const projectSchema = new mongoose.Schema({
    name :{
        type : "String",
        required : true,
        lowercase : true,
        trim : true
    },
    users : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user"

        }
    ]
})




export const projectModel = mongoose.model("project" , projectSchema);
