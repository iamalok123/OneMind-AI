import { useEffect } from "react"
import Home from "./pages/Home"
import getCurrentUser from "./features/getCurrentUser"
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
    <div className="w-full min-h-screen bg-[#0d0d0d]">
      <Home />
    </div>
  )
}

export default App