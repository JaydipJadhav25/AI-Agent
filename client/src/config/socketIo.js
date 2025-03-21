import { io } from "socket.io-client";





let socket = null; // To ensure a single instance



export const initSocket = (projectId) => {
    if (!socket) {

        socket = io("http://localhost:3000", {
            auth: {
                token: localStorage.getItem("token"), // Retrieve token from localStorage
            },
            query : {
                projectId
            }
        });


        // Log connection and disconnection events for debugging
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });

        console.log("Socket initialized");

    } else {

        console.log("Socket already initialized");
    }

    return socket;
};


// export const initSocket = (projectId) => {
//     // Check if a socket already exists and if the `projectId` matches
//     if (socket && socket.connected && socket.io.opts.query.projectId === projectId) {
//         console.log("Socket already initialized for projectId:", projectId);
//         return socket;
//     }

//     // If a socket exists for a different project, disconnect it
//     if (socket) {
//         console.log("Disconnecting socket for previous projectId:", socket.io.opts.query.projectId);
//         socket.disconnect();
//     }

//     // Initialize a new socket connection for the given `projectId`
//     socket = io("http://localhost:3000", {
//         auth: {
//             token: localStorage.getItem("token"), // Retrieve token from localStorage
//         },
//         query: {
//             projectId, // Pass the `projectId` to the server as a query parameter
//         },
//     });

//     // Log connection and disconnection events for debugging
//     socket.on("connect", () => {
//         console.log("Socket connected for projectId:", projectId, "with id:", socket.id);
//     });

//     socket.on("disconnect", () => {
//         console.log("Socket disconnected for projectId:", projectId);
//     });

//     return socket; // Return the initialized socket
// };



export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Socket disconnected and cleaned up");
        socket = null; // Reset the socket reference
    } else {
        console.log("No socket to disconnect");
    }
};

export const sendMeesage =(eventName , message , sender , mode)=>{

    // console.log("sendFunction call : ",eventName , message , sender)

    socket.emit(eventName , {message,sender , mode});
    
} 

// export const receviewMeesage = (eventName )

export const receiveMessage = (eventName, callback) => {
    if (socket) {

        socket.on(eventName, (data) => {
            // console.log("Message received:", data);
            callback(data);

        });
    } else {
        console.log("Socket is not initialized");
    }
};


