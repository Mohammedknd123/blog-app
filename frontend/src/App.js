import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Header from './components/Header/Header';  
import Login from './pages/forms/Login'
import Register from './pages/forms/Register'
import ForgotPassword from "./pages/forms/ForgotPassword";
import ResetPassword from "./pages/forms/ResetPassword";
import Home from "./pages/home/Home";
import PostPage from "./pages/postpage/PostPage";
import CreatePost from "./pages/create post/CreatePost";
import AdminDashboard from './pages/admin/AdminDashboard'
import Footer from './components/footer/Footer';
import PosDetails from './pages/post details/PostDetails';
import {ToastContainer} from 'react-toastify'
import Category from './pages/category/Category'
import Profile from './pages/profile/Profile';
import UsersTable from './pages/admin/UsersTable'
import PostsTable from "./pages/admin/PostsTable";
import CategoriesTable from "./pages/admin/CategoriesTable";
import CommentsTable from "./pages/admin/CommentsTable";
import NotFound from './pages/not found/NotFound';
import {useSelector} from 'react-redux'
import VerifyEmail from './pages/verify email/VerifyEmail';



function App() {
  const {user} = useSelector(state => state.auth)
  return (
    <BrowserRouter>
      <ToastContainer theme="colored" position="top-center" />
      <Header />
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/users/:userId/verify/:token"
          element={!user ? <VerifyEmail /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route path="posts">
          <Route index element={<PostPage />} />
          <Route
            path="createpost"
            element={user ? <CreatePost /> : <Navigate to="/" />}
          />
          <Route path="details/:id" element={<PosDetails />} />
          <Route path="categories/:category" element={<Category />} />
        </Route>
        <Route
          path="/admin"
          element={user?.isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/users-table"
          element={user?.isAdmin ? <UsersTable /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/posts-table"
          element={user?.isAdmin ? <PostsTable /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/categories-table"
          element={user?.isAdmin ? <CategoriesTable /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/comments-table"
          element={user?.isAdmin ? <CommentsTable /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
