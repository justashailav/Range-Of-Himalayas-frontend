import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const contactSlice=createSlice({
    name:"contact",
    initialState:{
        isLoading:false,
        contactResults:[],
        error: null,
        message: null
    },
    reducers:{
       contactFormHandlerStart: (state) => {
            state.isLoading = true;
            state.error = null;
            state.message = null;
        },
        contactFormHandlerSuccess: (state, action) => {
            state.isLoading = false;
            state.contactResults = action.payload;
            state.message = action.payload?.message;
        },
        contactFormHandlerFail: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        clearContactFormMessages: (state) => {
            state.error = null;
            state.message = null;
        }
    }
})

export const contactFormHandler=(formData)=>(dispatch)=>{
    dispatch(contactSlice.actions.contactFormHandlerStart());
    return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/contact`,formData,{
        headers:{
            "Content-Type": "application/json" 
        },
        withCredentials:true
    })
    .then((res)=>{
        dispatch(contactSlice.actions.contactFormHandlerSuccess(res.data))
    })
    .catch((error)=>{
        dispatch(contactSlice.actions.contactFormHandlerFail(error.response?.data?.message))
    })
}

export default contactSlice.reducer;