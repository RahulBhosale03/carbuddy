import styles from './searchRide.module.css';
import { useCallback, useState } from "react";
import { useRideContext } from '../../context/rideContext';
import { useNavigate } from 'react-router-dom';

export default function SearchRide() {
  const [loading, setLoading] = useState(false);
  const {searchRides, searchData, setSearchData, setDate} = useRideContext();
  const navigate = useNavigate();

  // const [searchData, handleOnChange] = useForm(searchData);

  const handleSubmit = useCallback(async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      await searchRides(searchData);
      navigate('/rides')
    } catch (error) {
      
    }finally{
      setLoading(false)
    }
    
  },[searchData, searchRides, navigate])

  const searchLocation = useCallback((e)=>{
    if (e.target.id==='from') {
      navigate('/searchOrigin');
    } else if (e.target.id==='to') {
      navigate('/searchDestination');
    }
  },[navigate])

  const handleOnChange = useCallback((e)=>{
    const {id, value} = e.target;
    setSearchData({...searchData, [id]:value})
  },[searchData, setSearchData])
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formItem}>
      <i className="fi fi-rs-marker"></i>
      <input
        type="text"
        id="from"
        placeholder="Leaving from"
        value={searchData.from}
        onChange={handleOnChange}
        onClick={searchLocation}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rs-marker"></i>
      <input
        type="text"
        id="to"
        placeholder="Going to"
        value={searchData.to}
        onChange={handleOnChange}
        onClick={searchLocation}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rr-calendar-day"></i>
      <input
        type="date"
        id="journeyDate"
        min={setDate()}
        value={searchData.journeyDate}
        onChange={handleOnChange}
        className={styles.formInput}
      />
      </div>
      <div className={styles.formItem}>
      <i className="fi fi-rr-user"></i>
      <input
        type="number"
        id="reqSeats"
        placeholder="Number of passengers"
        value={searchData.reqSeats}
        onChange={handleOnChange}
        className={styles.formInput}
      />
      </div>
      <button type='submit' className={styles.search}>{loading?<i className="fi fi-sr-loading"></i>:'Search'}</button>
    </form>
  );
}
