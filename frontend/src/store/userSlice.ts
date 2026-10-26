import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserData {
    userId?: string;
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    [key: string]: any;
}

interface UserState {
    userData: UserData | null;
}

const initialState: UserState = {
    userData: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserdata: (state, action: PayloadAction<UserData | null>) => {
            state.userData = action.payload;
        }
    }
});

export const { setUserdata } = userSlice.actions;
export default userSlice.reducer;