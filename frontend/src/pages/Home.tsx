import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../utils/firebase"
import { api } from "../utils/axios"
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setUserdata } from "../store/userSlice"
import Sidebar from "../components/Sidebar"
import Chat from "../components/Chat"
import Artifact from "../components/Artifact"
import Logo from "../components/Logo"

const Home = () => {
    const [loading, setLoading] = useState(false)

    const { userData } = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch()

    const handleLogin = async (token: string) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data?.user || data))
        } catch (error) {
            console.log(error)
        }
    }

    const googleLogin = async () => {
        try {
            setLoading(true)
            const data = await signInWithPopup(auth, googleProvider)
            const token = await data.user.getIdToken()
            await handleLogin(token)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (!userData) {
        return (
            <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#000000] text-[#ececec] select-none px-4 py-12'>
                {/* Center Auth Container */}
                <div className='w-full max-w-95 flex flex-col items-center'>

                    {/* OneMind AI Logo */}
                    <div className='relative mb-6 flex items-center justify-center'>
                        {/* Ambient backlight glow */}
                        <div className='absolute -inset-3 bg-white/10 rounded-full blur-xl pointer-events-none' />
                        <div className='w-16 h-16 rounded-2xl bg-[#141414] border border-white/12 flex items-center justify-center shadow-2xl shadow-black/80 relative transition-transform duration-200 hover:scale-105'>
                            <Logo className='w-9 h-9 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]' />
                        </div>
                    </div>

                    {/* Main Auth Card */}
                    <div className='w-full bg-[#181818] border border-neutral-800 rounded-2xl p-7 sm:p-8 flex flex-col gap-6 shadow-2xl shadow-black/60'>
                        {/* Header */}
                        <div className='flex flex-col items-center text-center gap-1.5'>
                            <h1 className='text-2xl font-semibold text-white tracking-tight'>
                                Welcome to OneMind AI
                            </h1>
                            <p className='text-[13px] text-neutral-400'>
                                Log in with your Google account to continue
                            </p>
                        </div>

                        {/* Google Sign-In Button */}
                        <button
                            onClick={googleLogin}
                            disabled={loading}
                            className='w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium text-[#ececec] bg-[#212121] hover:bg-[#2a2a2a] active:bg-[#1a1a1a] border border-neutral-700/80 hover:border-neutral-500 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs'
                        >
                            <FcGoogle size={19} className='shrink-0' />
                            <span>{loading ? "Signing in..." : "Continue with Google"}</span>
                        </button>

                        {/* Subtle Divider */}
                        <div className='relative flex items-center justify-center pt-1'>
                            <div className='w-full border-t border-neutral-800' />
                        </div>

                        {/* Terms & Privacy Note */}
                        <p className='text-center text-[12px] text-neutral-500 leading-relaxed'>
                            By continuing, you agree to our{" "}
                            <span className='text-neutral-400 hover:text-neutral-200 underline underline-offset-2 cursor-pointer transition-colors'>
                                Terms of Service
                            </span>{" "}
                            and{" "}
                            <span className='text-neutral-400 hover:text-neutral-200 underline underline-offset-2 cursor-pointer transition-colors'>
                                Privacy Policy
                            </span>
                            .
                        </p>
                    </div>

                </div>
            </div>
        )
    }

    return (
        <div className='w-full h-screen overflow-hidden flex bg-[#000000] text-[#ececec] select-none'>
            <Sidebar />
            <Chat />
            <Artifact />
        </div>
    )
}

export default Home
