import { useState } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../utils/firebase"
import { api } from "../utils/axios"
import { FcGoogle } from "react-icons/fc"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setUserdata } from "../store/userSlice"

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

    return (
        <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#0d0d0d] text-[#ececec] select-none px-4 py-12'>
            {!userData ? (
                /* Center Auth Container */
                <div className='w-full max-w-95 flex flex-col items-center'>

                    {/* Minimalist Monochrome Logo Mark */}
                    <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-md shadow-black/40'>
                        <svg
                            className='w-6 h-6 text-black'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                        >
                            <circle cx='12' cy='12' r='9' />
                            <circle cx='12' cy='12' r='4' />
                            <line x1='12' y1='3' x2='12' y2='8' />
                            <line x1='12' y1='16' x2='12' y2='21' />
                            <line x1='3' y1='12' x2='8' y2='12' />
                            <line x1='16' y1='12' x2='21' y2='12' />
                        </svg>
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
            ) : (
                <div className='flex flex-col items-center text-center gap-3'>
                    {userData.avatar && (
                        <img
                            src={userData.avatar}
                            alt={userData.name || 'User'}
                            className='w-16 h-16 rounded-full border border-neutral-700 shadow-md'
                        />
                    )}
                    <h1 className='text-2xl font-semibold text-white'>
                        Welcome{userData.name ? `, ${userData.name}` : ""}!
                    </h1>
                    {userData.email && (
                        <p className='text-sm text-neutral-400'>{userData.email}</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default Home