import {BrowserRouter , Routes , Route} from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Project from "../pages/Project"
import HomProtedPage from "../components/HomProtedPage"
import { SocketProvider } from "../context/SocketContext"


export default function AppRouter() {
  return (
<BrowserRouter>
 <SocketProvider>

   <Routes>
    <Route  path="/"  element={
      <HomProtedPage>
        <Home/>
      </HomProtedPage>
      
    }/>
    <Route  path="/login"  element={<Login/>}/>
    <Route  path="/signup"  element={<Signup/>}/>
    <Route  path="/project" element={<Project/>}/>
   </Routes>
 
    </SocketProvider>
</BrowserRouter>
  )
}
