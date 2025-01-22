import AppRouter from "./routes/AppRouter"
import { UserProvider } from './context/UserContext.jsx'


function App() {
 

  return (
    <>
<UserProvider>
<AppRouter/>
</UserProvider>
       
    </>
  )
}

export default App
