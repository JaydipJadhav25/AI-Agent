import {Router} from "express"
import { addUser, allProject, createProject, getProjectDetailes, updatefileTree } from "../controllers/project.controller.js";
import {authUser} from "../middleware/auth.moddleware.js"
import { body } from "express-validator";


const router = Router();


router.get("/" , (req, res) =>{
    return res.json({
        message : "THis is Project Route"
    })
});

router.post("/create" , authUser , 
    body('name').isString().withMessage("Name is Required")
    , createProject);


router.get("/all" , authUser , 
    allProject
)

router.put("/adduser" , authUser , 
    body("projectId").isString().withMessage("Projected is Must be requeied"),
    body("users").isArray({min : 1}).withMessage("user is must be required"),
    addUser
)


router.get("/get/:projectId" , authUser ,getProjectDetailes);

router.put("/updatefiletree" , authUser,  updatefileTree);


export default router;