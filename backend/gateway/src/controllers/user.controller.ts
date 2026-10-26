import { Request, Response } from "express"

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user
        if(!user){
            return res.status(401).json({ message: "Unauthorized - No user found" })
        }
        return res.status(200).json({ user });
    } catch (error: any) {
        return res.status(error?.statusCode || 500).json({ message: error?.message || error })
    }
}