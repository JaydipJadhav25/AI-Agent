import dotenv from "dotenv"
dotenv.config();
import express from "express"
import {createServer} from "http"
import cors from "cors"



const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended : true}));
// CORS options
const corsOptions = {
    origin: "http://localhost:5173", //  client origin
    credentials: true, // Allow cookies and credentials
  };
  
  // Use the CORS middleware with the specified options
  app.use(cors(corsOptions));






app.get("/" , (req , res)=>{
    return res.send("hello world");
})


export default server
