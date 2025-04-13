import { useCallback, useEffect, useState } from 'react';
import styles from './authPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import { useForm } from '../../hooks/useForm';
import Alert from '../../components/alert/Alert';

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [signInData, setSignInData] = useForm({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const {signInUser, errorMessage, setErrorMessage} = useAuthContext();

    const handleOnSubmit = useCallback(async(e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signInUser(signInData);
            result && navigate('/')
        } catch (error) {
            console.log('Error while signing in');
        }finally{
            setLoading(false);
        }
            
    },[navigate, signInData, signInUser])

    const handleCancel = useCallback((e)=>{
        e.preventDefault();
        navigate('/welcome');
    },[navigate]);
    useEffect(()=>{
        return ()=>{
            setErrorMessage(null)
        }
    },[setErrorMessage])
    return <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate}/>}
        <div className={styles.pageHead}>Sign In</div>
        <form onSubmit={handleOnSubmit} className={styles.form}>
            <div className={styles.formItem}>
                <label htmlFor='email' className={styles.formLabel}>Email</label>
                <input type='email' id='email' required placeholder='Enter email' value={signInData.email} onChange={setSignInData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='password' className={styles.formLabel}>Password</label>
                <input type='password' id='password' required placeholder='Enter password' value={signInData.password} onChange={setSignInData} className={styles.formInput}/>
            </div>
            <div className={styles.buttonContainer}>
                <button type='submit' className={`${styles.button} ${styles.submitButton}`}>{loading?<i className="fi fi-sr-loading"></i>:'Sign in'}</button>
                <button className={styles.button} onClick={handleCancel}>Cancel</button>
            </div>
            <div className={styles.switchMessage}>Already registered? <Link to={'/signup'}>Sign up</Link> here.</div>
        </form>
    </div>
}