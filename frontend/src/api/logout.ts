import { api } from "../utils/axios";
import { auth } from "../utils/firebase";
import { signOut } from "firebase/auth";

export const logoutUser = async () => {
    try {
        await api.post("/api/auth/logout");
    } catch (error) {
        console.log("Error logging out from server:", error);
    }
    try {
        await signOut(auth);
    } catch (error) {
        console.log("Error signing out from Firebase:", error);
    }
};
