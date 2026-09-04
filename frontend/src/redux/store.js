import {configureStore} from '@reduxjs/toolkit'
import { auReducer } from './slices/authSlice'
import { profileReducer } from './slices/profileSlice'
import { postsReducer } from './slices/postsSlice'
import { categoryReducer } from './slices/categorySlice'
import { commentReducer } from './slices/commentSlice'
import { passwordReducer } from './slices/passwordSlice'

const store = configureStore({
    reducer :{
        auth: auReducer,
        profile: profileReducer,
        post: postsReducer,
        category: categoryReducer,
        comment: commentReducer,
        password: passwordReducer
    }
})

export default store