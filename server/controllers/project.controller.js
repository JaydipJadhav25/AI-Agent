import { validationResult } from "express-validator";
import  * as projectService  from "../services/project.service.js";
import { projectModel } from "../model/project.model.js";




const createProject = async(req, res) =>{
 const error = validationResult(req);

    if(!error.isEmpty()){
      return res.status(401).json({ error : error.array()});
    
    }


    try {

        const {name} =req.body;
        const userId = req.user._id;

        //create 
        const project = await projectService.createProject(name, userId);

        if(!project){
      return res.status(401).json({ message : "Project creating error"});

        }

        
      return res.status(201).json({ message : "project created successfully " , project});



        
    } catch (error) {

      return res.status(401).json({ message : error.message});
        
    }



}
const allProject = async(req, res) =>{

  const userId  = req.user._id;

  // console.log("userId :" , userId);

  try {
    
    const projects = await projectService.getUserProject(userId);

    if(!projects){
    return res.status(401).json({ message : "Project find error"});
    }

    return res.status(201).json(projects);

  } catch (error) {

    return res.status(401).json({ message : error.message});

    
  }



}

const addUser = async(req , res) =>{

  const error = validationResult(req);

    if(!error.isEmpty()){
      
      return res.status(401).json({ error : error.array()});
    
    }

  const { projectId , users } = req.body;
  const userId = req.user._id;

  try {
    
const updateProject = await projectService.addUsersInProjects(projectId , users , userId);

// if(!updateProject){
//   return res.status(401).json({ message :"Update project error"});

// }

return res.status(201).json(updateProject)


  } catch (error) {

    return res.status(401).json({ message : error.message});
  }
}

const getProjectDetailes = async(req, res) =>{

  const {projectId} = req.params;

  console.log("projectid : " , projectId);

  try {

    const project = await projectModel.findById({_id : projectId}).populate("users");

    if(!project){

      throw new Error("fetch project datiles error");

    }

    return res.status(201).json(project);


    
  } catch (error) {

    return res.status(401).json({ message : error.message});

    
  }

}


const updatefileTree = async(req ,res) =>{
  const { projectId , fileTree} = req.body;


  console.log("filtree is coming : " , fileTree);

  if(!projectId || !fileTree){
    throw new Error("projectId and filetree is requried...........");
  }

  try {
    
    const project = await projectService.updateProject(projectId, fileTree);

    if(!project){
      throw new Error("fetch project datiles error");
    }

    return res.status(201).json(project);
    

  } catch (error) {
    return res.status(401).json({ message : error.message});
    
  }


}


export { createProject , allProject , addUser  , getProjectDetailes  , updatefileTree}