import "./PostPage.css";
import PostList from "../../components/posts/PostList";
import SideBar from "../../components/sidebar/SideBar";
import Pagination from "../../components/paginaton/Pagination";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, getPostsCount } from "../../redux/apiCalls/postsApiCall";

const POST_PER_PAGE = 3;
export default function PostPage() {
  const dispatch = useDispatch();
  const { postsCount, posts } = useSelector((state) => state.post);

  const [currentPage, setCurrentPage] = useState(1);
  const pages = Math.ceil(postsCount / POST_PER_PAGE);
  useEffect(() => {
    dispatch(fetchPosts(currentPage));
    window.scrollTo(0, 0);
  }, [currentPage, dispatch]);

  useEffect(() => {
    dispatch(getPostsCount());
  }, [dispatch]);
  return (
    <>
      <section className="postpage">
        <PostList posts={posts} />
        <SideBar />
      </section>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
