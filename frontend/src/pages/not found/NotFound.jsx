import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound () {
    return (
        <section className="not-found">
            <div className="not-found-title">404</div>
            <h1 className="not-found-text">Page Not found</h1>
            <Link to='/' className='not-found-link'>Go to home Page</Link>
        </section>
    )
}