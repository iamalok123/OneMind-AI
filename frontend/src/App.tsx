import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "./utils/firebase"
import { api } from "./utils/axios"

const App = () => {

  const handleLogin = async (token: string) => {
    try {
      const { data } = await api.post("/auth/login", { token })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  const googleLogin = async () => {
    const data = await signInWithPopup(auth, googleProvider)
    const token = await data.user.getIdToken() ;
    await handleLogin(token)
  }
  return (
    <div className="w-full h-screen bg-black flex flex-col justify-center items-center">
      <button className="bg-white text-black px-4 py-2 rounded" onClick={googleLogin}>
        Continue with Google
      </button>
    </div>
  )
}

export default App