import { useNavigate, useParams } from 'react-router-dom';
import styles from './rideDetails.module.css';
import { useCallback, useEffect, useState } from 'react';
import { useRideContext } from '../../context/rideContext';
import { useAuthContext } from '../../context/authContext';
import { useBookingContext } from '../../context/bookingContext';
import Alert from '../../components/alert/Alert';
export default function RideDetails(){
  const[loading, setLoading] = useState(false);
    const [startRideLoading, setStartRideLoading] = useState(false);
    const [cancelRideLoading, setCancelRideLoading] = useState(false);
    const [finishRideLoading, setFinishRideLoading] = useState(false);
    const [sendSOSLoading, setSendSOSLoading] = useState(false);
    const {user, errorMessage} = useAuthContext();
    const {rideId} = useParams();
    const {fetchRideDetails, rideDetails, changeRideStatus, getTimeFromDate, setUpdateData, sendSOS} = useRideContext();
    const {cancelBooking} = useBookingContext();
    const navigate = useNavigate();
    const fetchRide = useCallback(async(id)=>{
      setLoading(true)
      try {
        await fetchRideDetails(id);
      } catch (error) {
        
      }finally{
        setLoading(false)
      }
    },[fetchRideDetails])
    useEffect(()=>{
        fetchRide(rideId)
    },[fetchRide, rideId]);

    const goBack = useCallback(()=>{
            navigate(-1);
        },[navigate])
    
    const handleBookRide = useCallback(()=>{
        // navigate to book ride page
        navigate('/bookRide')
    },[navigate])
    const handleUpdateBooking = useCallback(()=>{
      // navigate to update booking page
      navigate('/updateBooking')
    },[navigate])
    const handleCancelBooking = useCallback(async(e)=>{
        const booking = rideDetails.passengers.find((booking)=>booking.primaryPassenger===user._id);
            if (booking) {
              setCancelRideLoading(true)
              try {
                await cancelBooking(rideDetails._id, booking.bookingId)
                navigate(-1);
              } catch (error) {
                
              }finally{
                setCancelRideLoading(false)
              }
                
            }
    },[navigate,cancelBooking, rideDetails, user])
    const handleUpdateRide = useCallback(()=>{
        setUpdateData();
        navigate("/updateRide")
    },[navigate,setUpdateData])
    const handleStartRide = useCallback(async()=>{
      setStartRideLoading(true);
      try {
        await changeRideStatus(rideId, "started")
      } catch (error) {
        
      }finally{
        setStartRideLoading(false)
      }
        
    },[changeRideStatus,rideId])
    const handleCancelRide = useCallback(async()=>{
      setCancelRideLoading(true)
      try {
        await changeRideStatus(rideId, "cancelled")
      } catch (error) {
        
      }finally{
        setCancelRideLoading(false)
      }
        
    },[changeRideStatus,rideId])
    const handleFinishRide = useCallback(async()=>{
      setFinishRideLoading(true)
      try {
        await changeRideStatus(rideId, "completed")
      } catch (error) {
        
      }finally{
        setFinishRideLoading(false)
      }
        
    },[changeRideStatus,rideId])

    const handleOpenMap = useCallback(()=>{
      navigate(`/map/${rideId}`);
    },[navigate, rideId])

    const handleSOS = useCallback(async()=>{
      if (user?.emergencyContacts?.length>0) {
        setSendSOSLoading(true);
        try {
          await sendSOS(rideId);
        } catch (error) {
          
        }finally{
          setSendSOSLoading(false);
        }
        
      }else{
        navigate('/addEmergency')
      }
    },[navigate, user, sendSOS, rideId])
    return (
      <>
        <div className={styles.main}>
          {errorMessage?.message && <Alert navigate={navigate}/>}
          <div className={styles.header}>
            <button onClick={goBack} className={styles.backButton}>
              <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
            </button>
            <div className={styles.pageHead}>Ride Details</div>
          </div>
          {loading ? (<div className={styles.loadingMessage}>Fetching ride details...</div>):
          (<div className={styles.infoContainer}>
            {/* Route Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Route</div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>From:</div>
              <div className={styles.infoValue}>
                {rideDetails?.startLocation?.address}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>To:</div>
              <div className={styles.infoValue}>
                {rideDetails?.endLocation?.address}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Distance:</div>
              <div className={styles.infoValue}>
                {rideDetails?.distance / 1000} KM
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Journey date:</div>
              <div className={styles.infoValue}>{rideDetails?.startTime.split('T')[0]}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Start Time:</div>
              <div className={styles.infoValue}>{getTimeFromDate(rideDetails?.startTime)}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Total Seats:</div>
              <div className={styles.infoValue}>{rideDetails?.totalSeats}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Available seats:</div>
              <div className={styles.infoValue}>
                {rideDetails?.availableSeats}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Fare:</div>
              <div className={styles.infoValue}>
              &#8377;{rideDetails?.farePerPerson}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Status</div>
              <div
                className={`${styles.infoValue} ${styles.status} ${
                  styles[rideDetails?.status]
                }`}
              >
                {rideDetails?.status}
              </div>
            </div>
          </div>
          {/* Vehicle Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Vehicle</div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Model Name:</div>
              <div className={styles.infoValue}>
                {rideDetails?.vehicleDetails?.vehicleName}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Color:</div>
              <div className={styles.infoValue}>
                {rideDetails?.vehicleDetails?.vehicleColor}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Number plate:</div>
              <div className={styles.infoValue}>
                {rideDetails?.vehicleDetails?.vehiclePlate}
              </div>
            </div>
          </div>
          {/* Owner Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Owner</div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Name:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.name}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Mobile:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.mobile}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Gender:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.gender}
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoHead}>Age:</div>
              <div className={styles.infoValue}>
                {rideDetails?.driverId?.age}
              </div>
            </div>
          </div>
          {/* Passenger Info */}
          <div className={styles.rideInfo}>
            <div className={styles.containerHead}>Passenger Info</div>
            <div className={styles.passengerContainer}>
              {rideDetails?.passengers?.length > 0
                ? rideDetails?.passengers?.map((booking) =>
                    booking.allPassengers?.map((passenger, index) => (
                      <div key={index} className={styles.passengerItem}>
                        <div className={styles.passengerName}>
                          {passenger.name}
                        </div>
                        <div className={styles.passengerGender}>
                          {passenger.gender}
                        </div>
                        <div className={styles.passengerAge}>
                          {passenger.age}
                        </div>
                      </div>
                    ))
                  )
                : "No Passengers Found"}
            </div>
          </div>
          </div>)}
        </div>
        {!loading && <div className={styles.rideActions}>
          <div className={styles.buttonContainer}>
          {rideDetails?.status === "active" ? (
            user._id === rideDetails?.driverId._id ? (
              <>
                <button onClick={handleCancelRide} className={`${styles.button} ${styles.cancelButton}`}>{cancelRideLoading?<i className="fi fi-sr-loading"></i>:'Cancel Ride'}</button>
                <button onClick={handleUpdateRide} className={`${styles.button} ${styles.updateButton}`}>Update</button>
                <button onClick={handleStartRide} className={styles.button}>{startRideLoading?<i className="fi fi-sr-loading"></i>:'Start'}</button>
              </>
            ) : (
              rideDetails?.passengers?.find((booking)=>booking.primaryPassenger===user._id) ?(
              <>
                <button onClick={handleCancelBooking} className={`${styles.button} ${styles.cancelButton}`}>{cancelRideLoading?<i className="fi fi-sr-loading"></i>:'Cancel Booking'}</button>
                <button onClick={handleUpdateBooking} className={styles.button}>Update Booking</button>
              </> ):(
                <><button onClick={handleBookRide} className={styles.button}>Book Ride</button></>
              )
            )
          ) : rideDetails?.status === "started" ? (
            user._id === rideDetails?.driverId._id ? (
              <>
                <button onClick={handleOpenMap} className={`${styles.button} ${styles.updateButton}`}>Open Map</button>
                <button onClick={handleFinishRide} className={styles.button}>{finishRideLoading?<i className="fi fi-sr-loading"></i>:'Finish Ride'}</button>
              </>
            ) : (
              rideDetails?.passengers?.find((booking)=>booking.primaryPassenger===user._id)?(<>
                <button onClick={handleOpenMap} className={`${styles.button} ${styles.updateButton}`}>Open Map</button>
                <button onClick={handleSOS} className={`${styles.button} ${styles.cancelButton}`}>{sendSOSLoading?<i className="fi fi-sr-loading"></i>:'SOS'}</button>
              </>):(
                <div className={styles.statusMessage}>{rideDetails?.status}</div>
              )
            )
          ) : (
            <div className={styles.statusMessage}>{rideDetails?.status}</div>
          )}
        
          </div>
        </div>}
      </>
    );
}