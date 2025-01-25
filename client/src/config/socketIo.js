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

        // socket.on("disconnect", () => {
        //     console.log("Socket disconnected");
        // });

        console.log("Socket initialized");
    } else {
        console.log("Socket already initialized");
    }

    return socket;
};


export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log("Socket disconnected and cleaned up");
        socket = null; // Reset the socket reference
    } else {
        console.log("No socket to disconnect");
    }
};
