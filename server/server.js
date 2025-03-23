import dotenv from "dotenv";
dotenv.config();
import server from "./index.js";
import { dbConnect } from "./db/dbConnection.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { findUserOnId } from "./services/user.service.js";
import { genrateResult } from "./services/ai.service.js";




await dbConnect();

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

// Socket middleware for authentication
io.use((socket, next) => {
    try {
        const token =
            socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.split(" ")[1];
        const projectId = socket.handshake.query?.projectId;

        if (!token) return next(new Error("Unauthorized! No token provided."));
        if (!projectId)
            return next(new Error("Project ID not provided! Access denied."));

        socket.projectId = projectId;

        const decodedToken = jwt.verify(token, process.env.JWT_SCERET);
        if (!decodedToken) return next(new Error("Invalid token."));

        socket.userId = decodedToken.id; // Attach userId
        next();
    } catch (error) {
        next(new Error(error.name === "TokenExpiredError" ? "Token expired." : "Authentication failed."));
    }
});

const projectUsers = {};


// Socket connection handler
io.on("connect", (socket) => {
    // console.log("User connected:", socket.id);
    socket.join(socket.projectId);

    socket.on("joinProject", ({ message: projectId, sender: userId }) => {

        // console.log("joinProject" , projectId, userId);

        if (!projectUsers[projectId]) projectUsers[projectId] = [];

        if (!projectUsers[projectId].includes(userId)) {
            projectUsers[projectId].push(userId);
        }
        io.to(projectId).emit("updateUsers", {
            projectId,
            users: projectUsers[projectId],
        });
    });

    socket.on("leaveProject", ({ message: projectId, sender: userId }) => {
        
        if (projectUsers[projectId]) {
            projectUsers[projectId] = projectUsers[projectId].filter((id) => id !== userId);
        }
        io.to(projectId).emit("updateUsers", {
            projectId,
            users: projectUsers[projectId],
        });
    });




    socket.on("message", async (msg) => {

        

        // console.log("data is : " , msg);
        //check message for ai
        const isMessageForAi= msg.message.includes('@ai')

        const user = await findUserOnId(msg.sender);

        //ai message alos send in all which users work on project
            socket.to(socket.projectId).emit("message", {
                message: msg.message,
                from: user.email,
            });

         
        
        if(isMessageForAi){

            const prompt = msg.message.replace('@ai' ,'');



            const replay = await genrateResult(prompt)

            // console.log("Message for ai!" , prompt);
            // console.log("replay  form ai!" , replay);


        
            const from = {
             _id : "100",
             email : "@ai"
            }


                
              
    
    
 

            //send replay to all connected users 

            io.to(socket.projectId).emit("message" , {
                // message : "this is Ai replay",
                message : replay,
                from : "@Ai"
            })

            

    


          


            //send ai replay only perticuler

            // io.to(socket.id).emit("message" , {
            //     message : replay,
            //     from : "@Ai"
            // });


                return;
        }

        // const user = await findUserOnId(msg.sender);
        // socket.to(socket.projectId).emit("message", {
        //     message: msg.message,
        //     from: user.email,
        // });


    });

    socket.on("disconnect", () => {


        for (const projectId in projectUsers) {
            projectUsers[projectId] = projectUsers[projectId].filter((id) => id !== socket.userId);
            io.to(projectId).emit("updateUsers", {
                projectId,
                users: projectUsers[projectId],
            });
        }
        console.log("User disconnected:", socket.id);
        socket.leave(socket.projectId);
    });
});



server.listen(process.env.PORT || 3000, () => {
    console.log(`Server starting on port ${process.env.PORT || 3000}`);
});
