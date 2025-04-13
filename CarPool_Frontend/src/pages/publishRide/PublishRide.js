
import { useCallback, useState } from 'react';
import { useRideContext } from '../../context/rideContext';
import styles from './publishRide.module.css';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/alert/Alert';
import { useAuthContext } from '../../context/authContext';
export default function PublishRide({type}) {
    const [loading, setLoading] = useState(false);
    const {errorMessage} = useAuthContext();
    const {setDate, publishData, setPublishData, publishRide, resetPublishData, updateRide} = useRideContext();
    const navigate = useNavigate();

    const handleOnSubmit=useCallback(async(e)=>{
        e.preventDefault();
        setLoading(true)
        try {
            if (type==='update') {
                await updateRide(publishData);
                navigate(-1)
            } else if(type==='publish'){
                await publishRide(publishData);
                navigate('/myrides')
            }
        } catch (error) {
            
        }finally{
            setLoading(false)
        }
        
    },[publishRide, publishData, navigate, type, updateRide])

    const handleOnReset = useCallback((e)=>{
        resetPublishData();
    },[resetPublishData])

    const handleOnChange = useCallback((e)=>{
        const {id, value} = e.target;
        setPublishData({...publishData, [id]:value});
    },[publishData, setPublishData])

    const searchLocation = useCallback((e)=>{
        if (e.target.id==='origin') {
          navigate('/publishOrigin');
        } else if (e.target.id==='destination') {
          navigate('/publishDestination');
        }
      },[navigate])

    const goBack = useCallback(()=>{
        resetPublishData()
        navigate(-1);
    },[navigate, resetPublishData])

    return <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate}/>}
        {type==='update' && <div className={styles.header}>
        <button onClick={goBack} className={styles.backButton}>
              <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
        </button>
        </div>}
    <form onSubmit={handleOnSubmit} onReset={handleOnReset} className={styles.form}>
        <div className={styles.itemContainer}>
            <div className={styles.formHeader}>
                Ride Details
            </div>
        <div className={styles.formItem}>
            <i className="fi fi-rs-marker"></i>
            <input type='text' id='origin' required value={publishData.origin} onChange={handleOnChange} onClick={searchLocation} placeholder='Start Location' className={styles.formInput}/>
        </div>
        <div className={styles.formItem}>
            <i className="fi fi-ss-marker"></i>
            <input type='text' id='destination' required value={publishData.destination} onChange={handleOnChange} onClick={searchLocation} placeholder='End Location'  className={styles.formInput}/>
        </div>
        <div className={styles.formItem}>
            <i className="fi fi-rr-calendar-day"></i>
            <input type='date' id='journeyDate' required value={publishData.journeyDate} onChange={handleOnChange} min={setDate()} className={styles.formInput}/>
        </div>
        <div className={styles.formItem}>
            <i className="fi fi-rr-clock-five"></i>
            <input type='time' id='startTime' required value={publishData.startTime} onChange={handleOnChange} className={styles.formInput}/>
        </div>
        <div className={styles.formItem}>
            <i className="fi fi-rr-person-seat-reclined"></i>
            <input type='number' id='totalSeats' required value={publishData.totalSeats} onChange={handleOnChange} placeholder='Total available seats' className={styles.formInput}/>
        </div>
        <div className={styles.formItem}>
            <i className="fi fi-sr-indian-rupee-sign"></i>
            <input type='number' id='farePerPerson' required value={publishData.farePerPerson} onChange={handleOnChange} placeholder='Fare per person' className={styles.formInput}/>
        </div>
        </div>
        <div className={styles.itemContainer}>
            <div className={styles.formHeader}>
                Vehicle Details
            </div>
            <div className={styles.formItem}>
                <i className="fi fi-tr-digital-tachograph"></i>
                <input type='text' id='vehicleName' required value={publishData.vehicleName} onChange={handleOnChange} placeholder='Model name'  className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <i className="fi fi-rr-palette"></i>
                <input type='text' id='vehicleColor' required  value={publishData.vehicleColor} onChange={handleOnChange} placeholder='Color'  className={styles.formInput}/>
            </div>
            <div className={styles.formItem}>
                <i className="fi fi-sr-hastag"></i>
                <input type='text' id='vehiclePlate' required  value={publishData.vehiclePlate} onChange={handleOnChange} placeholder='Number plate' className={styles.formInput}/>
            </div>
        </div>
        
        <div className={styles.buttonContainer}>
            <button type='reset' className={styles.button}>Reset</button>
            <button type='submit' className={`${styles.button} ${styles.submitButton}`}>{loading?<i className="fi fi-sr-loading"></i>:type}</button>
        </div>
    </form>
</div>
}