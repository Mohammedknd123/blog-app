import AdminSideBr from './AdminSideBar'
import './AdminTable.css'
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { deletePost, getAllPosts } from '../../redux/apiCalls/postsApiCall';

export default function PostsTable() {

  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);

  useEffect(() =>{
    dispatch(getAllPosts())
  }, [dispatch])

  // Delete Post Handler
  const deletePostHandler = (postId) => {
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
        dispatch(deletePost(postId))
      }
    });
  };
  return (
    <section className="table-container">
      <AdminSideBr />
      <div className="table-wrapper">
        <h1 className="table-title">Posts</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Post Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((item, index) => (
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
                <td>{item?.title}</td>
                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/posts/details/${item?._id}`}>View Post</Link>
                    </button>
                    <button onClick={() => deletePostHandler(item?._id)}>
                      Delete Post
                    </button>
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