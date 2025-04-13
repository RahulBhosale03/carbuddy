import { useCallback, useEffect, useState } from 'react';
import styles from './authPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/authContext';
import { useForm } from '../../hooks/useForm';
import Alert from '../../components/alert/Alert';

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [signUpData, setSignUpData] = useForm({
            name: "",
            email: "",
            password: "",
            mobile: "",
            gender:'',
            age:0
          });
    const navigate = useNavigate();

    const {signUpUser, errorMessage, setErrorMessage} = useAuthContext();

    const handleOnSubmit = useCallback(async (e)=>{
        e.preventDefault();
        setLoading(true)
        try {
            const result = await signUpUser(signUpData);
            result && navigate('/signin')
        } catch (error) {
            console.log('Error while signing up');
        }finally{
            setLoading(false)
        }
    },[navigate, signUpData, signUpUser])

    const handleCancel = useCallback((e)=>{
        e.preventDefault();
        navigate('/welcome');
    },[navigate]);

    useEffect(()=>{
            return ()=>{
                setErrorMessage(null)
            }
        },[setErrorMessage])
    return <>
    {errorMessage?.message && <Alert navigate={navigate}/>}
    <div className={styles.main}>
        <div className={styles.pageHead}>Sign Up</div>
        <form onSubmit={handleOnSubmit} className={styles.form}>
            <div className={styles.formItem}>
                <label htmlFor='name' className={styles.formLabel}>Name</label>
                <input type='text' id='name' required placeholder='Enter name' value={signUpData.name} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='email' className={styles.formLabel}>Email</label>
                <input type='email' id='email' required placeholder='Enter email' value={signUpData.email} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='password' className={styles.formLabel}>Password</label>
                <input type='password' id='password' required placeholder='Create password' value={signUpData.password} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='mobile' className={styles.formLabel}>Mobile</label>
                <input type='tel' id='mobile' required placeholder='Enter mobile' value={signUpData.mobile} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='age' className={styles.formLabel}>Age</label>
                <input type='number' id='age' required placeholder='Enter age' value={signUpData.age} onChange={setSignUpData} className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <label htmlFor='gender' className={styles.formLabel}>Gender</label>
                <select id='gender' defaultValue={signUpData.gender} required onChange={setSignUpData} className={styles.formInput}>
                    <option value={''} disabled>Select gender</option>
                    <option value={'male'}>Male</option>
                    <option value={'female'}>Female</option>
                </select>
            </div>
            <div className={styles.buttonContainer}>
                <button type='submit' className={`${styles.button} ${styles.submitButton}`}>{loading?<i className="fi fi-sr-loading"></i>:'Sign up'}</button>
                <button className={styles.button} onClick={handleCancel}>Cancel</button>
            </div>
            <div className={styles.switchMessage}>Already registered? <Link to={'/signin'}>Sign in</Link> here.</div>
        </form>
    </div>
    </>
}