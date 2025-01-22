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

export const getUserProject = async(userId)=>{

    if(!userId){
        throw new Error("UserId is field required!");
    }
    // const projects = await projectModel.find({users :[userId]});
    const projects = await projectModel.find({users :userId});


    return projects;
}

export const addUsersInProjects = async(projectId , users , userId) =>{

    if(!projectId || !users || !userId){
        throw new Error("All field required!");
    }

    //check current user in belong to project
    const project = await projectModel.find({
        _id : projectId,
        users : userId
    });

    console.log("projecy :" , project);
     
    if(project.length == 0){

        throw new Error("UnAuthorizes Acesses!");
    }

 
    //pdate
    const updatedProject = await projectModel.findByIdAndUpdate({_id : projectId},{
        $addToSet :{
            users :{
                $each : users
            }
        }
    },
{
    new : true
});

return updatedProject;


}


