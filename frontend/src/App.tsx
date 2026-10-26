import { useEffect } from "react"
import Home from "./pages/Home"
import getCurrentUser from "./features/getCurrentUser"


const App = () => {
  useEffect (() => {
    const getUser = async () => {
      await getCurrentUser()
    }
    getUser()
  }, [])
  
  return (
    <div className="w-full min-h-screen bg-[#0d0d0d]">
      <Home />
    </div>
  )
}

export default App