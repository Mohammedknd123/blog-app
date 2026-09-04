import { Link } from 'react-router-dom';
import PostList from '../../components/posts/PostList'
import SideBar from '../../components/sidebar/SideBar'
import './Home.css'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react';
import { fetchPosts } from '../../redux/apiCalls/postsApiCall';

export default function Home () {
  const {posts} = useSelector(state => state.post)
  const dispatch = useDispatch()
  useEffect(()=> {
    dispatch(fetchPosts(1))
  },[dispatch])

    return (
      <section className="home">
        <div className="home-hero-header">
          <div className="home-hero-header-layout">
            <h1 className="home-title">Welcome to Blog</h1>
          </div>
        </div>
        <div className="home-latest-posts">Latest Posts</div>
        <div className="home-container">
          <PostList posts={posts} />
          <SideBar />
        </div>
        <div className="home-see-posts-link">
            <Link to='/posts' className='home-link'>
            See All Posts
            </Link>
        </div>
      </section>
    );
}