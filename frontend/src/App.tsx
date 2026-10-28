import { useEffect } from "react"
import Home from "./pages/Home"
import { getCurrentUser } from "./api/getCurrentUser"
import { useDispatch } from "react-redux"
import { setUserdata } from "./store/userSlice"


const App = () => {

  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const data = await getCurrentUser()
      dispatch(setUserdata(data))
    }
    getUser()
  }, [])

  return (
    <div className="w-full h-screen bg-[#000000] overflow-hidden">
      <Home />
    </div>
  )
}

export default App