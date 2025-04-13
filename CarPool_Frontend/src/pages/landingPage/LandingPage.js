import styles from './landingPage.module.css';
import backgroundImage from './../../assets/images/landing_bg.jpg'
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useAuthContext } from '../../context/authContext';
export default function LandingPage() {
    const navigate = useNavigate();
    const {isLoggedIn} = useAuthContext();

    useEffect(()=>{
        if (isLoggedIn) {
            navigate('/');
        }
    },[navigate,isLoggedIn])
    
    const handleOnClick=useCallback((e)=>{
        const {id} = e.target;
        if (id==='signup') {
            navigate('/signup');
        } else if(id==='signin'){
            navigate('/signin');
        }
    },[navigate])
    
    return <div className={styles.main}>
        <img className={styles.backgroundImage} src={backgroundImage} alt='landing-bg'/>
        <div className={styles.headMessage}>Your pick of rides at low prices</div>
        <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${styles.signUpButton}`} id='signup' onClick={handleOnClick}>Sign Up</button>
            <button className={styles.button} id='signin' onClick={handleOnClick}>Sign In</button>
        </div>
    </div>
}