import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { socket } from "../App"


export const searchUser = createAsyncThunk("chat/searchUser", async (args, thunkapi) => {
    const { rejectWithValue } = thunkapi
    try {
        const res = await axios.post(`${process.env.REACT_APP_BASEURL}/login/searchuser`, { searchValue: args || '' })
        console.table(res.data);
        return res.data
    } catch (error) {
        return rejectWithValue(error.response.data.mess || error.message)
    }
})
export const checkroomExist = createAsyncThunk("chat/checkroom", async (args, thunkapi) => {
    const { rejectWithValue, getState } = thunkapi
    const id = getState().authSlice.user._id
    try {
        const res = await axios.post(`${process.env.REACT_APP_BASEURL}/room/create`, { me: id, user2: args })

        return res.data
    } catch (error) {
        console.log(error.response);

        return rejectWithValue(error.message)
    }

})
export const chatavialable = createAsyncThunk("chat/chatavlilable", async (args, thunkapi) => {
    const { rejectWithValue, getState } = thunkapi
    const id = getState().authSlice.user._id

    try {
        const res = await axios.post(`${process.env.REACT_APP_BASEURL}/room/find`, { id: id })
        return res.data
    } catch (error) {
        return rejectWithValue(error.response.data.mess || error.message)
    }
})

export const openChat = createAsyncThunk("chat/openchat", async (args, thunkapi) => {
    const { rejectWithValue, dispatch } = thunkapi
    socket.emit("join room", args.chatId)
    dispatch(openchatuser(args))
    try {
        const res = await axios.get(`${process.env.REACT_APP_BASEURL}/message/get/${args.chatId}`)
        return res.data
    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const sendMessage = createAsyncThunk("chat/sendMessage", async (args, thunkapi) => {
    const { rejectWithValue, dispatch } = thunkapi

    try {
        const res = await axios.post(`${process.env.REACT_APP_BASEURL}/message/add`, { roomid: args.roomid, message: args.messcontent, usersendid: args.userid })
        socket.emit("send message", res.data)
        return res.data
    } catch (error) {
        return rejectWithValue(error.message)
    }

})

const chatSlice = createSlice({
    name: "chat",
    initialState: { chatId: null, searchuser: [], chatAvilable: [], openChate: { user: {}, allChats: [], loading: false }, searchloading: false },
    reducers: {
        openchatuser: (state, action) => {
            state.openChate = { ...state.openChate, user: action.payload.chatuser }
            state.chatId = action.payload.chatId

        },
        addmessage: (state, action) => {
            state.openChate.allChats = [...state.openChate.allChats, action.payload]
        }
    },
    extraReducers: {
        [searchUser.pending]: (state, action) => {
            state.searchloading = true
            state.searchuser = []

        },
        [searchUser.fulfilled]: (state, action) => {
            state.searchloading = false
            state.searchuser = action.payload

        },
        [searchUser.rejected]: (state, action) => {
            state.searchloading = false
            state.searchuser = []

        },

        // check room

        [checkroomExist.pending]: (state, action) => {

        },
        [checkroomExist.fulfilled]: (state, action) => {

            state.chatAvilable = [...state.chatAvilable, action.payload]

        },
        [checkroomExist.rejected]: (state, action) => {


        },
        // available chat 
        [chatavialable.pending]: (state, action) => {

        },
        [chatavialable.fulfilled]: (state, action) => {

            state.chatAvilable = action.payload

        },
        [chatavialable.rejected]: (state, action) => {
            // state.chatAvilable = []

        },
        // open chat
        [openChat.pending]: (state, action) => {
            state.openChate.loading = true
        },
        [openChat.fulfilled]: (state, action) => {
            state.openChate.loading = false
            state.openChate = { ...state.openChate, allChats: action.payload }
        },
        [openChat.rejected]: (state, action) => {
            state.openChate.loading = false
            state.openChate.allChats = []
        },
        // send message
        [sendMessage.pending]: (state, action) => {

        },
        [sendMessage.fulfilled]: (state, action) => {

            state.openChate.allChats = [...state.openChate.allChats, action.payload]
        },
        [sendMessage.rejected]: (state, action) => {

        },

    }
})

export const { openchatuser, addmessage } = chatSlice.actions
export default chatSlice.reducer