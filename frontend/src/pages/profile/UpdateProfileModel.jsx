import './UpdateProfileModel.css'
import { useState } from 'react';
import {useDispatch} from 'react-redux'
import { updateProfile } from '../../redux/apiCalls/profileApiCall';


export default function UpdateProfileModel({ setUpdateProfile, profile }) {
    const [username, setUsername] = useState(profile.username)
    const [bio, setBio] = useState(profile.bio)
    const [password, setPassword] = useState('');
    const dispatch = useDispatch()
    
    // Form Submit Handler 
    const formSybmitHandler = (e) => {
        e.preventDefault()
        
        const updatedUser = {username, bio}
        if (password.trim() !== '') {
            updatedUser.password = password;
        }

        dispatch(updateProfile(profile?._id, updatedUser))
        setUpdateProfile(false)
    }
  return (
    <div className="update-profile">
      <form onSubmit={formSybmitHandler} className="update-profile-form">
        <abbr title="close">
          <i
            onClick={() => setUpdateProfile(false)}
            className="bi bi-x-circle-fill update-profile-form-close"
          ></i>
        </abbr>
        <h1 className="update-profile-title">Update Your Profile</h1>
        <input
          type="text"
          className="update-profile-input"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          className="update-profile-input"
          placeholder="New bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="password"
          className="update-profile-input"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="update-profile-btn">
          Update Profile
        </button>
      </form>
    </div>
  );
}