import { postsActions } from "../slices/postsSlice";
import {commentActions} from '../slices/commentSlice'
import request from "../../utils/request";
import { toast } from "react-toastify";

// Create Comment
export function createComment(newComment) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post("/api/comments", newComment, {
        headers: {
            Authorization: "Bearer " + getState().auth.user.token
        }
      });

      dispatch(postsActions.addComment(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Update Comment
export function updateComment(commentId, comment) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/comments/${commentId}`, comment, {
        headers: {
            Authorization: "Bearer " + getState().auth.user.token
        }
      });

      dispatch(postsActions.updateComment(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

// Delete Comment
export function deleteComment(commentId) {
  return async (dispatch, getState) => {
    try {
      await request.delete(`/api/comments/${commentId}`, {
        headers: {
            Authorization: "Bearer " + getState().auth.user.token
        }
      });

      dispatch(commentActions.deleteComments(commentId));
      if (getState().post?.post?.comments) {
        dispatch(postsActions.deleteComment(commentId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete comment");
    }
  };
}

// Fetch All Comments
export function getAllComments() {
  return async (dispatch, getState) => {
    try {
      const {data} = await request.get(`/api/comments`, {
        headers: {
            Authorization: "Bearer " + getState().auth.user.token
        }
      });

      dispatch(commentActions.setComments(data))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}