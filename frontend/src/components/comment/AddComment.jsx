import './AddComment.css'
import { useState } from 'react'
import {toast} from 'react-toastify'
import {useDispatch} from 'react-redux'
import { createComment } from '../../redux/apiCalls/commentApiCall'

export default function AddComemnt ({postId}) {

  const dispatch = useDispatch()

    const [text, setText] = useState('')

    //Submit form Handler
    const submitFormHandler = (e) => {
        e.preventDefault()
        if (text.trim() === '') return toast.error('Please write Something')
            
        dispatch(createComment({ text, postId }));
        setText('')
    }
    return (
      <form onSubmit={submitFormHandler} className="add-comment">
        <input
          type="text"
          placeholder="Add a Comment"
          className="add-comment-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="add-comment-btn">
          Comment
        </button>
      </form>
    );
}