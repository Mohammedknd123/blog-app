import './CreatePost.css'
import { useState, useEffect } from 'react';
import {toast} from 'react-toastify'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import { createPost } from '../../redux/apiCalls/postsApiCall';
import {ScaleLoader} from 'react-spinners'
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall';

export default function CreatePost() {
  const dispatch = useDispatch()
  const {loading, isPostCreated} = useSelector(state => state.post)
  const { categories } = useSelector((state) => state.category);

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState(null);

  // Form Submit Handler
  const formSubmitHandler = (e) => {
    e.preventDefault()
    if(title.trim() === '') return toast.error("Post title is empty")
    if(description.trim() === '') return toast.error("Post description is empty")
    if (category.trim() === "") return toast.error("Post category is empty");
    if (!file) return toast.error("Post image is empty");

    const formData = new FormData()
    formData.append("image", file)
    formData.append("title", title)
    formData.append("description", description)
    formData.append("category", category);

    dispatch(createPost(formData))
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (isPostCreated) {
      navigate('/')
    }
  }, [isPostCreated, navigate])

  useEffect(() => {
    dispatch(fetchCategories())
  },[dispatch])

  return (
    <section className="create-post">
      <h1 className="create-post-title">Create New Post</h1>
      <form onSubmit={formSubmitHandler} className="create-post-form">
        <input
          type="text"
          className="create-post-input"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="create-post-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled value="">
            Select a Category
          </option>
          {categories.map(category => <option key={category._id} value={category.title}>{category.title}</option>)}
        </select>
        <textarea
          rows="5"
          placeholder="Post Description"
          className="create-post-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="file"
          name="file"
          id="file"
          className="create-post-upload"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" className="create-post-btn">
          {loading ? (
            <ScaleLoader barCount={4} color="#ffffff" height={15} width={2} />
          ) : (
            "Create"
          )}
        </button>
      </form>
    </section>
  );
}
