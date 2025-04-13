import styles from './ridesList.module.css';
import RideCard from "../../components/rideCard/RideCard";
import { useRideContext } from "../../context/rideContext"
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/alert/Alert';
import { useAuthContext } from '../../context/authContext';

export default function RidesList({type}) {
  const [loading, setLoading] = useState(false);
  const { errorMessage } = useAuthContext();
    const {rides, fetchRideHistory} = useRideContext();
    const navigate = useNavigate();
    const {searchData} = useRideContext();
    const fetchRidesOnLoad = useCallback(async()=>{
      setLoading(true);
      try {
        await fetchRideHistory()
      } catch (error) {
        
      }finally{
        setLoading(false)
      }
    },[fetchRideHistory])

    useEffect(()=>{
      if (type==='history') {
        fetchRidesOnLoad()
      }
    },[fetchRidesOnLoad, type]);

    const goBack = useCallback(()=>{
        navigate(-1);
    },[navigate])
    return (
      <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate} />}
        <div className={styles.header}>
          {type === "result" && (
            <button onClick={goBack} className={styles.backButton}>
              <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
            </button>
          )}
          <span className={styles.date}>
            {type === "result" && `Rides on ${searchData.journeyDate}`}
            {type === "history" && "My Rides"}
          </span>
        </div>
        <div className={styles.ridesList}>
          {loading ? (
            <div className={`${styles.noDataFound} ${styles.loading}`}>Fetching ride history...</div>
          ) : rides.length > 0 ? (
            rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
          ) : (
            <div className={styles.noDataFound}>No rides found</div>
          )}
        </div>
      </div>
    );
}