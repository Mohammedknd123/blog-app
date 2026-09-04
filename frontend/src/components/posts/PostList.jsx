import PostItem from "./PostItem";
export default function PostList({ posts }) {
  return (
    <div className="post-list">
      {posts.map((item) => (
        <PostItem post={item} key={item._id} />
      ))}
    </div>
  );
}
