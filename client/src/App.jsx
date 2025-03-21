import AppRouter from "./routes/AppRouter"
import { UserProvider } from './context/UserContext.jsx'
import Navbar from "./pages/Navbar.jsx"




function App() {
 

  return (
    <>
<UserProvider>
{/* <Navbar/> */}
<AppRouter/>
</UserProvider>
       
    </>
  )
}

export default App
