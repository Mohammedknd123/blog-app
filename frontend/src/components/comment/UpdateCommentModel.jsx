import './UpdateCommentModel.css'
import { useState } from 'react';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateComment } from '../../redux/apiCalls/commentApiCall';

export default function UpdateCommentModel({ setUpdateComment, commentForupdate }) {
  const dispatch = useDispatch();
  const [text, setText] = useState(commentForupdate?.text);
  // Form Submit Handler
  const formSybmitHandler = (e) => {
    e.preventDefault();
    if (text.trim() === "") return toast.error("Please write Something");
    dispatch(updateComment(commentForupdate?._id, {text}));
    setUpdateComment(false)
  };
  return (
    <div className="update-post">
      <form onSubmit={formSybmitHandler} className="update-comment-form">
        <abbr title="close">
          <i
            onClick={() => setUpdateComment(false)}
            className="bi bi-x-circle-fill update-comment-form-close"
          ></i>
        </abbr>
        <h1 className="update-comment-title">Edit Comment</h1>
        <input
          type="text"
          className="update-comment-input"
          placeholder="New title"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="update-comment-btn">
          Edit Comment
        </button>
      </form>
    </div>
  );
}