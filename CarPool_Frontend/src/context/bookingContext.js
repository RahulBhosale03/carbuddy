import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";
import { useAuthContext } from "./authContext";

const bookingContext = createContext();
export const useBookingContext = ()=>{
    const value = useContext(bookingContext);
    return value
}

export function BookingContextProvider({children}){
    const {token, composeErrorMessage} = useAuthContext();
    const [allPassengers, setAllPassengers] = useState([]);

    const handleOnChangePassenger = useCallback((e, index)=>{
        const {id, value} = e.target;
        setAllPassengers((prevPassengers)=>prevPassengers.map(
            (passenger, i)=>
                i===index?({...passenger, [id]:value}):passenger))
    },[])

    const handleAddPassenger = useCallback(()=>{
            setAllPassengers([...allPassengers, {name:"", gender:"", age: 0}])
    },[allPassengers])

    const handleRemovePassenger = useCallback((index)=>{
        if (allPassengers.length>1) {
            setAllPassengers(allPassengers.filter((_, i)=>i!==index))   
        }
    },[allPassengers])

    const bookRide = useCallback(async(rideId)=>{
      try {
        console.log("Ride Id", rideId);
        console.log("all passengers", allPassengers);
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.post(`${backendUrl}/api/booking`,{
          rideId:rideId,
          totalPassengers: allPassengers.length,
          allPassengers: allPassengers
        },{
          headers:{
            Authorization: token
          }
        })
        console.log("Booking Response", response.data);
        
      } catch (error) {
        composeErrorMessage(error)
        console.log(error.response?.data || error.message || error);
      }
    },[allPassengers, token, composeErrorMessage]);

    const updateBooking = useCallback(async(rideId, bookingId)=>{
      try {
        console.log(rideId, bookingId);
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.put(`${backendUrl}/api/booking/${bookingId}`,{
          rideId: rideId,
          totalPassengers: allPassengers.length,
          allPassengers: allPassengers
        },{
          headers:{
            Authorization: token
          }
        })
        console.log("Update Response", response.data);
        
      } catch (error) {
        composeErrorMessage(error)
        console.log(error.response?.data || error.message || error);
      }
    },[allPassengers, token, composeErrorMessage])

    const cancelBooking = useCallback(async (rideId, bookingId)=>{
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.put(`${backendUrl}/api/booking/cancel/${bookingId}`,{},{
          headers:{
            Authorization: token
          }
        })
        console.log("Cancel Resoponse", response.data);
      } catch (error) {
        composeErrorMessage(error)
        console.log(error.response?.data || error.message || error);
      }
    },[token, composeErrorMessage])

    return (
      <bookingContext.Provider
        value={{
          allPassengers,
          setAllPassengers,
          handleOnChangePassenger,
          handleAddPassenger,
          handleRemovePassenger,
          bookRide,
          updateBooking,
          cancelBooking
        }}
      >
        {children}
      </bookingContext.Provider>
    );
}