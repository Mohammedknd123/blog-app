import './Profile.css'
import { useState, useEffect } from 'react'
import {toast} from 'react-toastify'
import Swal from "sweetalert2";
import UpdateProfileModel from './UpdateProfileModel'
import {useDispatch, useSelector} from 'react-redux'
import { getUserProfile, uploadProfilePhoto, deleteProfile } from '../../redux/apiCalls/profileApiCall'
import { useParams, useNavigate } from 'react-router-dom'
import {logout} from '../../redux/apiCalls/authApiCall'
import PostItem from '../../components/posts/PostItem';
import {ScaleLoader} from 'react-spinners'

export default function Profile () {
    const [file, setFile] = useState(null)
    const [updateProfile, setUpdateProfile] = useState(false) 
    const dispatch = useDispatch()
    const {profile, loading, isProfileDeleted} = useSelector(state => state.profile)
    const {user} = useSelector(state => state.auth)

    // Form Submit Handler
    const formSubmitHandler = (e) => {
        e.preventDefault()
        if (!file) return toast.warning('there is no file')
        
        const formData = new FormData()
        formData.append('image', file)  
        dispatch(uploadProfilePhoto(formData))
    }

    const {id} = useParams()
    useEffect(() => {
        dispatch(getUserProfile(id));
        window.scrollTo(0, 0)
    }, [id, dispatch])

    const navigate = useNavigate()
    useEffect(() => {
      if (isProfileDeleted) {
        navigate('/')
      }
    }, [navigate, isProfileDeleted]);

    // Delete Account Handler
    const deleteAccountHandler = () => {
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
            dispatch(deleteProfile(user?._id))
            dispatch(logout())
          }
        });
      };


      if (loading) {
        return (
          <div className='profile-loader'>
            <ScaleLoader barCount={4} color="#333" height={20} width={3} />
          </div>
        );
      }

    return (
      <section className="profile">
        <div className="profile-header">
          <div className="profile-image-wrapper">
            <img
              src={file ? URL.createObjectURL(file) : profile?.profilephoto.url}
              alt=""
              className="profile-image"
            />
            {user?._id === profile?._id && (<form onSubmit={formSubmitHandler}>
              <abbr title="choose profile photo">
                <label
                  htmlFor="file"
                  className="bi bi-camera-fill upload-profile-photo-icon"
                ></label>
              </abbr>
              <input
                style={{ display: "none" }}
                type="file"
                name="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button type="submit" className="upload-profile-photo-btn">
                Upload
              </button>
            </form>)}
          </div>
          <h1 className="profile-username">{profile?.username}</h1>
          <p className="profile-bio">
            {profile?.bio}
          </p>
          <div className="user-date-joined">
            <strong>Date Joined: </strong>
            <span>{profile?.createdAt ? new Date(profile.createdAt).toDateString() : ""}</span>
          </div>
          {user?._id === profile?._id && (<button onClick={() => setUpdateProfile(true)} className="profile-update-btn">
            <i className="bi bi-file-person-fill"></i>
            Update Profile
          </button>)}
        </div>
        <div className="profile-posts-list">
          <h2 className="profile-posts-list-title">{profile?.username} Posts</h2>
          {profile?.posts?.map(post =>
            <PostItem key={post._id} post={post} username={profile?.username} userId={profile?._id} />
          )}
        </div>
        {user?._id === profile?._id && (<button onClick={deleteAccountHandler} className="delete-account-btn">Delete Your Account</button>)}
        {updateProfile && <UpdateProfileModel profile={profile} setUpdateProfile={setUpdateProfile} /> }
      </section>
    );
}