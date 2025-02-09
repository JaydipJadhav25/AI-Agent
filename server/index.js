import dotenv from "dotenv"
dotenv.config();
import express from "express"
import {createServer} from "http"
import cors from "cors"
import userRoutes from "./routes/user.routes.js"
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/project.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import { authUser } from "./middleware/auth.moddleware.js";


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

const app = express();
const server = createServer(app);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
// CORS options
const corsOptions = {
    origin: "http://localhost:5173", //  client origin
    credentials: true, // Allow cookies and credentials
  };
  
  // Use the CORS middleware with the specified options
  app.use(cors(corsOptions));

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//


app.get("/" , (req , res)=>{

////////////////////////////////////////////////////////////////////
  return res.send("hello world");         
////////////////////////////////////////////////////////////////////  

});




//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
app.use("/user" , userRoutes);
app.use("/project" , projectRoutes);
app.use("/ai" , authUser , aiRoutes);
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//


export default server
