import { Link } from 'react-router-dom'
import './SideBar.css'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react'
import { fetchCategories } from '../../redux/apiCalls/categoryApiCall'

export default function SideBar () {
    const dispatch = useDispatch()
    const {categories} = useSelector(state => state.category)

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])
    return (
        <div className="sidebar">
            <h5 className="sidebar-title">CATEGORIES</h5>
            <ul className="sidebar-links">
                {categories.map((category) => 
                <Link className='sidebar-link' key={category._id} to={`/posts/categories/${category.title}`}>
                    {category.title}
                </Link>
                )}
            </ul>
        </div>
    )
}