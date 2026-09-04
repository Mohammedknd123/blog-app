import AdminSideBr from "./AdminSideBar";
import "./AdminTable.css";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteComment, getAllComments } from "../../redux/apiCalls/commentApiCall";

export default function CommentsTable() {

  const dispatch = useDispatch()
  const {comments} = useSelector(state => state.comment)

  useEffect(() => {
    dispatch(getAllComments())
  }, [dispatch])

  // Delete Comment Handler
  const deleteCommentHandler = (commentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteComment(commentId))
      }
    });
  };
  return (
    <section className="table-container">
      <AdminSideBr />
      <div className="table-wrapper">
        <h1 className="table-title">Comments</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {comments?.map((item, index) => (
              <tr key={item?._id}>
                <td>{index + 1}</td>
                <td>
                  <div className="table-image">
                    <img
                      src={item?.user?.profilephoto?.url}
                      className="table-user-image"
                      alt=""
                    />
                    <spane className="table-username">
                      {item?.user?.username}
                    </spane>
                  </div>
                </td>
                <td>{item?.text}</td>
                <td>
                  <div className="table-button-group">
                    <button onClick={() => deleteCommentHandler(item?._id)}>Delete Comment</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
