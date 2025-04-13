import { useCallback, useEffect, useState } from 'react';
import styles from './booking.module.css';
import { useNavigate } from 'react-router-dom';
import { useRideContext } from '../../context/rideContext';
import { useBookingContext } from '../../context/bookingContext';
import { useAuthContext } from '../../context/authContext';
import Alert from '../../components/alert/Alert';

export default function Booking({type}) {
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [availableSlots, setAvailableSlots] = useState(1);
    const {user, errorMessage} = useAuthContext();
    const { rideDetails } = useRideContext();
    const {
      allPassengers,
      handleOnChangePassenger,
      handleAddPassenger,
      handleRemovePassenger,
      setAllPassengers,
      bookRide,
      updateBooking
    } = useBookingContext();
    // console.log("All passengers def", typeof allPassengers, allPassengers);

    useEffect(()=>{
        const prevBooking = rideDetails.passengers.find((booking)=>booking.primaryPassenger===user._id);
        console.log("Prev Booking ",prevBooking);
        setAllPassengers(prevBooking?[...prevBooking.allPassengers]:[{name:"", gender:"", age: 0}]);
        setAvailableSlots(prevBooking?rideDetails.availableSeats:rideDetails.availableSeats-1)
    },[setAllPassengers, rideDetails, user])

    const handleOnSubmit=useCallback(async(e)=>{
        e.preventDefault();
        setLoading(true)
        try {
          if (type==='update') {
            const booking = rideDetails.passengers.find((booking)=>booking.primaryPassenger===user._id);
            if (booking) {
                await updateBooking(rideDetails._id, booking.bookingId)
                navigate(-1)
            }
        } else if(type==='book'){
            await bookRide(rideDetails._id)
            navigate('/myrides')
        }
        } catch (error) {
          
        }finally{
          setLoading(false)
        }
        
    },[type, bookRide, rideDetails, navigate, updateBooking, user])

    const addPassengers = useCallback(()=>{
        if (availableSlots>0) {
            handleAddPassenger()
            setAvailableSlots(availableSlots-1)
        }
    },[handleAddPassenger, availableSlots])

    const removePassenger = useCallback((index)=>{
      if (allPassengers.length>1) {
        handleRemovePassenger(index)
        setAvailableSlots(availableSlots+1); 
      }
    },[handleRemovePassenger,availableSlots, allPassengers])

    const handleOnChange = useCallback((e)=>{
        // Handle on change input if required in future
    },[])

    const handleCancel = useCallback((e)=>{
        navigate(-1);
    },[navigate])
    return (
      <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate}/>}
        <div className={styles.header}>
          <button onClick={handleCancel} className={styles.backButton}>
            <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
          </button>
          <div className={styles.pageHead}>Book a Ride</div>
        </div>
        <form onSubmit={handleOnSubmit} className={styles.form}>
          <div className={styles.itemContainer}>
            <div className={styles.formHeader}>Booking Details</div>
            <div className={styles.formItem}>
              <i className="fi fi-rs-marker"></i>
              <input
                type="text"
                id="boarding"
                onChange={handleOnChange}
                value={rideDetails?.startLocation?.address}
                placeholder="Boarding point"
                disabled
                className={styles.formInput}
              />
            </div>
            <div className={styles.formItem}>
              <i className="fi fi-ss-marker"></i>
              <input
                type="text"
                id="dropping"
                onChange={handleOnChange}
                value={rideDetails?.endLocation?.address}
                placeholder="Dropping point"
                disabled
                className={styles.formInput}
              />
            </div>
            <div className={styles.formItem}>
              <i className="fi fi-rr-calendar-day"></i>
              <input
                type="date"
                id="journeyDate"
                onChange={handleOnChange}
                value={rideDetails?.startTime.split("T")[0]}
                placeholder="Dropping point"
                disabled
                className={styles.formInput}
              />
            </div>
            <div className={styles.formItem}>
              <i className="fi fi-rr-person-seat-reclined"></i>
              <input
                type="number"
                id="totalPassengers"
                min={1}
                max={rideDetails?.availableSeats}
                value={allPassengers?.length}
                placeholder="Total passengers"
                disabled
                className={styles.formInput}
              />
            </div>
          </div>
          <div className={styles.itemContainer}>
            <div className={styles.formHeader}>Passenger Details</div>
            {allPassengers.map((passenger, index) => (
              <div key={index} className={styles.passengerContainer}>
                <button
                  type="button"
                  onClick={() => {
                    removePassenger(index);
                  }}
                  className={styles.removeButton}
                >
                  <i className="fi fi-rr-cross-circle"></i>
                </button>
                <div className={styles.formHeader}> Passenger {index + 1}</div>
                <div className={styles.formItem}>
                  <i className="fi fi-tr-id-card-clip-alt"></i>
                  <input
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={passenger.name}
                    required
                    onChange={(e) => {
                      handleOnChangePassenger(e, index);
                    }}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formItem}>
                  <i className="fi fi-rr-venus-mars"></i>
                  <select
                    id="gender"
                    required
                    defaultValue={passenger.gender}
                    onChange={(e) => {
                      handleOnChangePassenger(e, index);
                    }}
                    className={styles.formInput}
                  >
                    <option value={""} disabled>
                      Select gender
                    </option>
                    <option value={"male"}>Male</option>
                    <option value={"female"}>Female</option>
                  </select>
                </div>
                <div className={styles.formItem}>
                  <i className="fi fi-rr-age"></i>
                  <input
                    type="number"
                    id="age"
                    placeholder="Age"
                    value={passenger.age}
                    required
                    onChange={(e) => {
                      handleOnChangePassenger(e, index);
                    }}
                    className={styles.formInput}
                  />
                </div>
              </div>
            ))}
            {availableSlots !== 0 && (
              <div className={styles.addButtonContainer}>
              <button
                type="button"
                onClick={addPassengers}
                className={styles.button}
              >
                Add more passenger
              </button>
              </div>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={handleCancel}
              className={styles.button}
            >
              Back
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitButton}`}
            >
              {loading?<i className="fi fi-sr-loading"></i>:type}
            </button>
          </div>
        </form>
      </div>
    );
}