import { createSlice } from "@reduxjs/toolkit"


const authSlice = createSlice({
    name: "auth",
    initialState: { user: {}, token: null, },
    reducers: {
        saveuser: (state, action) => {
            state.user = action.payload.user

        },
        logOut: (state, action) => {
            localStorage.removeItem("token")
            state.user = []

        },

    }
})


export const { saveuser,logOut } = authSlice.actions
export default authSlice.reducer