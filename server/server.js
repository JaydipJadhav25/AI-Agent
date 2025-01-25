import server  from "./index.js"
import {dbConnect} from "./db/dbConnection.js"
import {Server} from "socket.io"



 dbConnect();


const io = new Server(server ,{
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});


io.on("connect", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    });
});




server.listen(process.env.PORT , ()=>{
    console.log(`server starting on port ${process.env.PORT}`)
})