
import styles from './searchLocation.module.css';
import { useMapContext } from '../../context/mapsContext';
import { useNavigate } from 'react-router-dom';
import PredictionItem from '../../components/predictionItem/PredictionItem';
import { useEffect, useRef } from 'react';
import Alert from '../../components/alert/Alert';
import { useAuthContext } from '../../context/authContext';

export default function SearchLocation({type}){
    const { errorMessage } = useAuthContext();
    const {handleOnChange, searchText, predictions, clear} = useMapContext();
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const handleOnClick = (e)=>{
        clear();
        navigate(-1);
    }
    useEffect(()=>{
        searchRef.current.focus();
    },[])
    return <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate}/>}
        <div className={styles.header}>
            <button className={styles.backButton} onClick={handleOnClick}>
                <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
            </button>
            <input type='text' ref={searchRef} className={styles.searchBox} value={searchText} onChange={handleOnChange} placeholder='Search place name'/>
        </div>
        <div>
            {predictions.map((prediction)=><PredictionItem key={prediction.place_id} type={type} prediction={prediction}/>)}
        </div>
    </div>;
}