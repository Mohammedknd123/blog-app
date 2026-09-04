import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    postsCount: [],
    postsCate: [],
    loading: false,
    isPostCreated: false,
    post: null
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    setPostsCount(state, action) {
      state.postsCount = action.payload;
    },
    setPostsCate(state, action) {
      state.postsCate = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setIsPostCreated(state) {
      state.isPostCreated = true;
      state.loading = false;
    },
    clearIsPostCreated(state) {
      state.isPostCreated = false;
    },
    setPost(state, action) {
      state.post = action.payload
    },
    setLike(state, action) {
      state.post.likes = action.payload.likes
    },
    deletePost(state, action) {
      state.posts = state.posts.filter(p => p.id !== action.payload)
    },
    addComment(state, action) {
      state.post.comments.push(action.payload)
    },
    updateComment(state, action) {
      state.post.comments = state.post.comments.map(comment => 
        comment._id === action.payload._id ? action.payload : comment
      )
    },
    deleteComment(state, action) {
      const comment = state.post.comments.find(c => c._id === action.payload)
      const commentIndex = state.post.comments.indexOf(comment)
      state.post.comments.splice(commentIndex, 1)
    }
  },
});

const postsReducer = postsSlice.reducer;
const postsActions = postsSlice.actions;

export { postsReducer, postsActions };
