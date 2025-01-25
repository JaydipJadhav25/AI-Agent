import {createContext, useMemo} from "react"
import {io} from "socket.io-client"


export const SocketContext = createContext();



export const SocketProvider = (props) =>{

    const socket = useMemo(()=> io("http://localhost:3000") , []);


    return (
        <SocketContext.Provider value={{socket}}>
            {props.children}
        </SocketContext.Provider>
    )
}

