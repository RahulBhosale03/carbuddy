import { useAuthContext } from '../../context/authContext';
import styles from './alert.module.css';
export default function Alert({navigate}) {
  const {errorMessage, setErrorMessage, logoutUser} = useAuthContext();
  const handleOnClick = ()=>{
    if (navigate && errorMessage.errorCode===401) {
      logoutUser();
      navigate('/signin')
    }
    setErrorMessage(null)
  }
    return <div className={styles.alertContainer}>
    <div className={styles.alert}>
      <div className={styles.alertMessage}>{errorMessage.message}</div>
      <button onClick={handleOnClick} className={styles.alertButton}>Okay</button>
    </div>
  </div>
}