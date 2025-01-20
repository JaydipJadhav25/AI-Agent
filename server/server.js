import server  from "./index.js"
import {dbConnect} from "./db/dbConnection.js"




 dbConnect();

server.listen(process.env.PORT , ()=>{
    console.log(`server starting on port ${process.env.PORT}`)
})