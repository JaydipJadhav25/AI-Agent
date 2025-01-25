import dotenv from "dotenv"
dotenv.config()
import server  from "./index.js"
import {dbConnect} from "./db/dbConnection.js"
import {Server} from "socket.io"
import jwt from "jsonwebtoken"


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
        const projectId = socket.handshake.query?.projectId;
        console.log("projectId : " , projectId);              

        // console.log("Token:", token);

        // Check if the token exists
        if (!token) {
            return next(new Error("Unauthorized Access! No token provided."));
        }


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

// Socket connection handler
io.on("connect", (socket) => {
    console.log("User connected:", socket.id);

    // Emit a welcome message to the connected client
    io.emit("hello", "Connected to server.");

    // Listen for custom client events
    socket.on("hello", (msg) => {
        console.log("Client message:", msg);
    });

    // Handle client disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});




server.listen(process.env.PORT , ()=>{
    console.log(`server starting on port ${process.env.PORT}`)
})