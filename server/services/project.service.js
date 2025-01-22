import {projectModel} from "../model/project.model.js"


export  const createProject = async(name , userId )=>{
    if(!name || !userId){
        throw new Error("All field required!");
    }


    const existingProject = await projectModel.findOne({name : name});

    if(existingProject){
        throw new Error("Projct Already Existing......");

    }

    const project = await projectModel.create({
        name : name ,
        users  :[userId]
    });

    if(!project){
        throw new Error("Projct creatring error");
    }

    return project;

}