import AdminSideBr from './AdminSideBar'
import './AdminTable.css'
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2'
import {useSelector, useDispatch} from 'react-redux'
import { useEffect } from 'react'
import { deleteProfile, getUsersProfiles } from '../../redux/apiCalls/profileApiCall'

export default function UsersTable() {
  const dispatch = useDispatch()
  const {profiles, isProfileDeleted} = useSelector(state => state.profile)

  useEffect(() => {
    dispatch(getUsersProfiles())
  }, [dispatch, isProfileDeleted])

  // Delete User Handler
  const deleteUserHandler = (userId) => {
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
        dispatch(deleteProfile(userId))
      }
    });
  };
  return (
    <section className="table-container">
      <AdminSideBr />
      <div className="table-wrapper">
        <h1 className="table-title">Users</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>User</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((item, index) => (
              <tr key={item?._id}>
                <td>{index + 1}</td>
                <td>
                  <div className="table-image">
                    <img
                      src={item?.profilephoto?.url}
                      className="table-user-image"
                      alt=""
                    />
                    <spane className="table-username">{item?.username}</spane>
                  </div>
                </td>
                <td>{item?.email}</td>
                <td>
                  <div className="table-button-group">
                    <button>
                      <Link to={`/profile/${item?._id}`}>View Profile</Link>
                    </button>
                    <button onClick={() => deleteUserHandler(item?._id)}>Delete User</button>
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