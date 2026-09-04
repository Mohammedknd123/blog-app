import './AdminDashboard.css'
import AdminMain from './AdminMain'
import AdminSideBar from './AdminSideBar'
export default function AdminDashboard() {
  return (
    <section className='admin-dashboard'>
      <AdminSideBar />
      <AdminMain />
    </section>
  )
}
