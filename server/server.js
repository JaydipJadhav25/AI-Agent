import dotenv from "dotenv"
dotenv.config()
import server  from "./index.js"
import {dbConnect} from "./db/dbConnection.js"
import {Server} from "socket.io"
import jwt from "jsonwebtoken"
import { findUserOnId } from "./services/user.service.js"


await dbConnect();


 
 const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// Socket middleware
io.use((socket, next) => {
    try {
        // Retrieve token from handshake
        const token = socket.handshake.auth?.token || 
                      socket.handshake.headers?.authorization?.split(" ")[1];
        //get project id                
        const projectId = socket.handshake.query?.projectId;
        console.log("projectId : " , projectId);    
        
        // console.log("Token:", token);

        // Check if the token exists
        if (!token) {
            return next(new Error("Unauthorized Access! No token provided."));
        }

        if(!projectId){
            return next(new Error("Project Is Not Accessed Access! No ProjectID provided."));
        }

        socket.projectId = projectId



        // Verify the token
        // console.log("JWT_SECRET :" , process.env.JWT_SCERET);

        const decodedToken = jwt.verify(token, process.env.JWT_SCERET);


        if (!decodedToken) {
            return next(new Error("Unauthorized Access! Invalid token."));
        }

        // Attach decoded token to the socket
        socket.user = decodedToken;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);

        next(new Error("Authentication failed!"));
    }
});

const connectedUser = new Map();//all user
const onlineUserOnProjects = Array()
// function getUserCountByProjectId(projectId) {

//     let count = 0;

//     for (const value of connectedUser.values()) {
//         if (value === projectId) {
//             count++;
//         }
//     }

//     return count;
// }





// Socket connection handler
io.on("connect", (socket) => {
    console.log("User connected:", socket.id);

    // Emit a welcome message to the connected client
    
    
    // console.log("projectid in socket  id : " , socket.projectId);
    
    //connted users
    connectedUser.set(socket.id , socket.projectId);
    
    //create Room :
    socket.join(socket.projectId);
    
    const count =  updateOnlineUserCount(socket.projectId);
         io.to(socket.projectId).emit("online", count);


    // const user = connectedUser.get(socket.projectId)
    // const user = connectedUser.forEach((e)=>{

    //     if(e === socket.projectId){
    //         console.log("online user in give project : " , e);
    //         onlineUserOnProjects.push(e);
    //     }
        

    // })

    // const online = connectedUser.values(socket.projectId);

//    const online = connectedUser.has(socket.projectId) ? connectedUser.get(socket.projectId).size : 0;
//     console.log("Online : " , online);

// const projectId = socket.projectId; // Assume this is available
// const count = getUserCountByProjectId(projectId);
// console.log(`Number of users in project ${projectId}: ${count}`);


    // io.emit("online" , count);
    // socket.to(projectId).emit("online" , count);






    // Listen for custom client events
    socket.on("message", async(msg) => {
       

        //send in room
        // console.log("user message : " , msg);

        const user = await findUserOnId(msg.sender);

        // console.log("projectId : " , socket.projectId);
        // console.log("usr email : ", user);

        socket.to(socket.projectId).emit("message" , {message : msg.message , from : user.email});



    });


    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // connectedUser.clear(socket.id);//remove user
            // Remove the user from the connected users
            connectedUser.delete(socket.id);
            updateOnlineUserCount(socket.projectId);

    });








     // Function to update the online user count for a project
     function updateOnlineUserCount(projectId) {
        const count = [...connectedUser.values()].filter(
            (id) => id === projectId
        ).length;

        // Emit to all clients in the specific project room
        console.log("online users : " , count);

        // io.to(projectId).emit("online", count);
        return count;
    }

});




server.listen(process.env.PORT , ()=>{
    console.log(`server starting on port ${process.env.PORT}`)
})