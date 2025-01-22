import { validationResult } from "express-validator";
import  * as projectService  from "../services/project.service.js";




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





export { createProject }