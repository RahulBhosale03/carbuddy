import { useNavigate } from 'react-router-dom';
import styles from './rideCard.module.css'
export default function RideCard({ride}){
    const navigate = useNavigate();
    const handleOnClick = (e)=>{
        navigate(`/rideDetails/${ride._id}`);
    }
    return (
      // Ride Card
      <div className={styles.rideCard} onClick={handleOnClick}>
        {/* Ride info */}
        <div className={styles.rideInfo}>
          <div className={styles.routeInfo}>
            <div>{ride.startLocation.address}</div>
            <div className={styles.icon}>
              <i className="fi fi-ts-map-location-track"></i>
            </div>
            <div>{ride.endLocation.address}</div>
          </div>
          <div className={styles.fare}>&#8377;{ride.farePerPerson}</div>
        </div>
        {/* Driver Info */}
        <div className={styles.footer}>
          <div className={styles.driverInfo}>
            <i className="fi fi-bs-car"></i>
            <span>{ride.driverId.name}</span>
          </div>
          <div className={`${styles.status} ${styles[ride.status]}`}>
            {ride.status}
          </div>
        </div>
      </div>
    );
}