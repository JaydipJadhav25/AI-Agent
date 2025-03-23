import mongoose from "mongoose";
import { type } from "os";



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
    ],
    fileTree : {
        type : Object,
        default : {}
    }
})




export const projectModel = mongoose.model("project" , projectSchema);
