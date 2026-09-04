import AdminSideBr from './AdminSideBar'
import './AdminTable.css'
import Swal from 'sweetalert2'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react'
import { deleteCategory, fetchCategories } from '../../redux/apiCalls/categoryApiCall'

export default function CategoriesTable() {

  const dispatch = useDispatch()
  const {categories} = useSelector(state => state.category)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Delete Category Handler
  const deleteCategoryHandler = (categoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCategory(categoryId))
      }
    });
  };
  return (
    <section className="table-container">
      <AdminSideBr />
      <div className="table-wrapper">
        <h1 className="table-title">Categories</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Count</th>
              <th>Category Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category?._id}>
                <td>{index + 1}</td>
                <td>
                  <b>{category?.title}</b>
                </td>
                <td>
                  <div className="table-button-group">
                    <button onClick={() => deleteCategoryHandler(category?._id)}>Delete Category</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}