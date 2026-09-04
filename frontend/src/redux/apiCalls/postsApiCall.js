import { postsActions } from "../slices/postsSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";

// Fetch posts based on page number
export function fetchPosts(pageNumber) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?pageNumber=${pageNumber}`);

      dispatch(postsActions.setPosts(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Get all posts
export function getAllPosts() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts`);

      dispatch(postsActions.setPosts(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Get posts count
export function getPostsCount() {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/count`);

      dispatch(postsActions.setPostsCount(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Fetch posts based on category
export function fetchPostsBasedonCategory(category) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(
        `/api/posts?category=${encodeURIComponent(category)}`,
      );

      dispatch(postsActions.setPostsCate(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Create Post
export function createPost(newPost) {
  return async (dispatch, getState) => {
    try {
      dispatch(postsActions.setLoading());
      await request.post(`/api/posts`, newPost, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(postsActions.setIsPostCreated());
      setTimeout(() => dispatch(postsActions.clearIsPostCreated()), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
      dispatch(postsActions.clearLoading);
    }
  };
}

// Fetch Single Post
export function fetchSinglePost(postId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/${postId}`);

      dispatch(postsActions.setPost(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Toggle Like Post
export function toggleLikePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        },
      );

      dispatch(postsActions.setLike(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Update Post Image
export function updatePostImage(newImage, postId) {
  return async (dispatch, getState) => {
    try {
      await request.put(`/api/posts/update-image/${postId}`, newImage, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("New Post image uploaded Succefully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Update Post
export function updatePost(newPost, postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/posts/${postId}`, newPost, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
        },
      });
      dispatch(postsActions.setPost(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Delete Post
export function deletePost(postId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: "Bearer " + getState().auth.user.token,
        },
      });
      dispatch(postsActions.deletePost(data.postId));
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}
