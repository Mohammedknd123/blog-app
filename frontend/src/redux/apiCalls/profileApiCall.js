import { profileActions } from "../slices/profileSlice";
import request from "../../utils/request";
import { toast } from "react-toastify";
import {authActions} from '../slices/authSlice'

// Get User Profile
export function getUserProfile(userId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/users/profile/${userId}`);

      dispatch(profileActions.setProfile(data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load profile");
    }
  };
}

// Upload Profile Photo
export function uploadProfilePhoto(newPhoto) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.post(
        `/api/users/profile/profile-photo-upload`,
        newPhoto,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        },
      );

      dispatch(profileActions.setProfilePhoto(data.profilephoto));
      dispatch(authActions.setUserPhoto(data.profilephoto))

      
      toast.success(data.message);

      // modify the user iin local storage with the new photo
      const user = JSON.parse(localStorage.getItem('userInfo'))
      user.profilephoto = data.profilephoto
      localStorage.setItem('userInfo', JSON.stringify(user))
    } catch (error) {
      toast.error(error.response?.data?.message || "Photo upload failed");
    }
  };
}


// Update Profile 
export function updateProfile(userId, profile) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(
        `/api/users/profile/${userId}`,
        profile,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        },
      );

      dispatch(profileActions.updateProfile(data));
      dispatch(authActions.setUsername(data.username));

      // modify the user iin local storage with the new photo
      const user = JSON.parse(localStorage.getItem('userInfo'))
      user.username = data?.username
      localStorage.setItem('userInfo', JSON.stringify(user))
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
}

// Delete Profile 
export function deleteProfile(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.delete(
        `/api/users/profile/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        },
      );

      dispatch(profileActions.setIsProfileDeleted());
      toast.success(data?.message)
      setTimeout(() => {
        dispatch(profileActions.clearIsProfileDeleted());
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message);
      dispatch(profileActions.clearLoading())
    }
  };
}

// Get Users Count (for Admin Dashboard)
export function getUsersCount() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/api/users/count`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        },
      );

      dispatch(profileActions.setUsersCount(data));
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
}

// Get Users Profiles (for Admin Dashboard)
export function getUsersProfiles() {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/api/users/profile`,
        {
          headers: {
            Authorization: "Bearer " + getState().auth.user.token,
          },
        },
      );

      dispatch(profileActions.setProfiles(data));
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
}

