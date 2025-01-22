import {Router} from "express"
import { getAllUsers, userLogin, userLogOut, userProfile, userSignup } from "../controllers/user.controller.js";
import {body} from "express-validator"
import { authUser } from "../middleware/auth.moddleware.js";

const router = Router();



router.get("/" , (req , res)=>{
    return res.json({message :  "this is user route"});
})


router.post("/signup",
    body('email').isEmail().withMessage("Valid email is required"),
    body('password').isLength({min : 4}).withMessage("Passowrd must be at least 3 char"),
    userSignup
)



router.post("/login",
    body('email').isEmail().withMessage("Valid email is required"),
    body('password').isLength({min : 4}).withMessage("Passowrd must be at least 3 char"),
    userLogin
)


router.get("/logout" , authUser , userLogOut);

router.get("/profile" , authUser , userProfile);

router.get("/all" , authUser , getAllUsers);


export default router