import {BrowserRouter , Routes , Route} from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Project from "../pages/Project"
import HomProtedPage from "../components/HomProtedPage"

export default function AppRouter() {
  return (
<BrowserRouter>

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
 
</BrowserRouter>
  )
}
