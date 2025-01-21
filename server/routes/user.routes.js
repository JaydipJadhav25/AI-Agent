import {Router} from "express"
import { userSignup } from "../controllers/user.controller.js";
import {body} from "express-validator"


const router = Router();



router.get("/" , (req , res)=>{
    return res.json({message :  "this is user route"});
})


router.post("/signup",
    body('email').isEmail().withMessage("Valid email is required"),
    body('password').isLength({min : 4}).withMessage("Passowrd must be at least 3 char"),
    userSignup
)






export default router