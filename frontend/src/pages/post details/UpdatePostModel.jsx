import './UpdatePostModel.css'
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from '../../redux/apiCalls/postsApiCall';
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';

export default function UpdatePostModel({ setUpdatePost, post }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

    const [title, setTitle] = useState(post.title)
    const [category, setCategory] = useState(post.category)
    const [description, setDescription] = useState(post.description);
    
    // Form Submit Handler 
    const formSybmitHandler = (e) => {
        e.preventDefault()
        if(title.trim() === '') return toast.error("Post title is empty")
        if(description.trim() === '') return toast.error("Post description is empty")
        if (category.trim() === "") return toast.error("Post category is empty");
        
        dispatch(updatePost({title, category, description}, post?._id))
        setUpdatePost(false)
    }

    useEffect(() => {
      dispatch(fetchCategories())
    }, [dispatch])

  return (
    <div className="update-post">
      <form onSubmit={formSybmitHandler} className="update-post-form">
        <abbr title="close">
          <i
            onClick={() => setUpdatePost(false)}
            className="bi bi-x-circle-fill update-post-form-close"
          ></i>
        </abbr>
        <h1 className="update-post-title">Update Post</h1>
        <input
          type="text"
          className="update-post-input"
          placeholder="New title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="update-post-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled value="">
            Select a Category
          </option>
          {categories.map((category) => (
            <option value={category.title} key={category._id} >{category.title}</option>
          ))}
        </select>
        <textarea
          rows="5"
          name=""
          id=""
          className="update-post-textarea"
          placeholder="description ..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit" className="update-post-btn">
          Update Post
        </button>
      </form>
    </div>
  );
}