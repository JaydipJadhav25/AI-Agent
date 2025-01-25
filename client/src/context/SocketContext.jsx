// import {createContext, useMemo} from "react"
// import {io} from "socket.io-client"


// export const SocketContext = createContext();



// export const SocketProvider = (props) =>{

//     const socket = useMemo(() => {
//         return io("http://localhost:3000", {
//             auth: {
//                 token: localStorage.getItem("token"), // Retrieve token from localStorage
//             },
//         });
//     }, []); // Empty dependency array ensures socket is initialized once




//     return (
//         <SocketContext.Provider value={{socket}}>
//             {props.children}
//         </SocketContext.Provider>
//     )
// }

