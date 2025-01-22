import {Router} from "express"
import { createProject } from "../controllers/project.controller.js";
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





export default router;