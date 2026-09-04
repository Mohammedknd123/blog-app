import './CommentList.css'
import Swal from "sweetalert2";
import UpdateCommentModel from '../../components/comment/UpdateCommentModel'
import {useState} from 'react'
import Moment from 'react-moment'
import { useSelector, useDispatch } from "react-redux";
import { deleteComment } from '../../redux/apiCalls/commentApiCall';

export default function CommentList ({comments}) {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);

  const [updateComment, setUpdateComment] = useState(false);
  const [commentForupdate, setCommentForUpdate] = useState(null);

  // Update Comment Handler 
  const updateCommentHandler = (comment) => {
    setCommentForUpdate(comment)
    setUpdateComment(true)
  }

    // Delete Comment Handler
      const deletePostHandler = (commentId) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) dispatch(deleteComment(commentId));
        });
      };
    return (
      <div className="comment-list">
        <h4 className="comment-list-count">{comments?.length} comments</h4>
        {comments?.map((comment) => (
          <div className="comment-item" key={comment._id}>
            <div className="comment-item-info">
              <div className="comment-item-username">{comment.username}</div>
              <div className="comment-item-time">
                <Moment fromNow ago>{comment.createdAt}</Moment>{" "}
                ago
              </div>
            </div>
            <p className="comment-item-text">{comment.text}</p>
            {user?._id === comment.user && (<div className="comment-item-icon-wrapper">
              <i
                onClick={() => updateCommentHandler(comment)}
                className="bi bi-pencil-square"
              ></i>
              <i onClick={() => deletePostHandler(comment?._id)} className="bi bi-trash-fill"></i>
            </div>)}
          </div>
        ))}
        {updateComment && (
          <UpdateCommentModel commentForupdate={commentForupdate} setUpdateComment={setUpdateComment} />
        )}
      </div>
    );
}