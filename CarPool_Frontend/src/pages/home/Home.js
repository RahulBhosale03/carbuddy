import styles from './home.module.css';
import backgroundImage from './../../assets/images/home-bg.png'
import SearchRide from '../../components/searchRide/SearchRide';
import Alert from '../../components/alert/Alert';
import { useAuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const {errorMessage} = useAuthContext();
  const navigate = useNavigate()
    return (
      <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate}/>}
        <img src={backgroundImage} alt="home-background" className={styles.homeBackground}/>
        <SearchRide/>
      </div>
    );
}