import { useEffect } from 'react'
import PostList from '../../components/posts/PostList'
import './Category.css'
import {useParams, Link} from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { fetchPostsBasedonCategory } from '../../redux/apiCalls/postsApiCall'

export default function Category () {
    const dispatch = useDispatch();
    const { postsCate } = useSelector((state) => state.post);
    const {category} = useParams()

    useEffect( ()=> {
        dispatch(fetchPostsBasedonCategory(category))
        window.scrollTo(0, 0)
    }, [category, dispatch])
    return (
      <section className="category">
        {postsCate.length === 0 ? (
          <>
            <h1 className="category-not-found">
              Posts with <span>{category}</span> category not Found
            </h1>
            <Link to='/posts' className='category-not-found-link'>Go to Posts Page</Link>
          </>
        ) : (
          <>
            <h1 className="category-title">Posts based on {category}</h1>
            <PostList posts={postsCate} />
          </>
        )}
      </section>
    );
}