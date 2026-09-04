import './VerifyEmail.css'
import {Link, useParams} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { useEffect } from 'react';
import { verifyEmail } from '../../redux/apiCalls/authApiCall';

export default function VerifyEmail () {
    const dispatch = useDispatch()
    const { isEmailVerified } = useSelector((state) => state.auth);

    const {userId, token} = useParams()

    useEffect(() => {
        dispatch(verifyEmail(userId, token));
    }, [dispatch, userId, token])

    return (
        <section className="verify-email">
            {isEmailVerified ? <>
            <i className="bi bi-patch-check verify-email-icon"></i>
            <h1 className="verify-email-title">Your email has been Succefully verified</h1>
            <Link to='/login' className='verify-email-link'>
            Go to Login Page</Link>
            </> : 
            <>
            <h1 className="verify-email-not-found">Not Found</h1>
            </>}
        </section>
    )
}