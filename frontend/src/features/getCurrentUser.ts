import { api } from "../utils/axios"

const getCurrentUser = async () => {
    try {
        const { data } = await api.get("/api/me")
        return data?.user || data
    } catch (error: any) {
        console.log("Not authenticated or session expired:", error?.response?.data?.message || error.message)
        return null
    }
}

export default getCurrentUser