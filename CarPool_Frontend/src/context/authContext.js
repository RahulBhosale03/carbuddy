import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";

const authContext = createContext();
export const useAuthContext = ()=>{
    const value = useContext(authContext);
    return value;
}

export function AuthContextProvider({children}){
    const [token, setToken] = useState('');
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emergencyContacts, setEmergencyContacts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    const composeErrorMessage = useCallback((error)=>{
      if(!error.response){
        if (error.request) {
          setErrorMessage("Network error. Please check your connection and try again.");
        } else {
          setErrorMessage("An unexpected error occurred. Please try again.");
        }
        return
      }
      const { status, data} = error.response;
      const {message} = data;
      switch (status) {
        case 400:
          setErrorMessage({errorCode:status, message: message || "Invalid request. Please check your input."});
          break;
        case 401:
          setErrorMessage({errorCode:status, message: message || "You are not authorized. Please log in and try again."});
          break;
        case 403:
          setErrorMessage({errorCode:status, message: message || "You don't have permission to perform this action."});
          break;
        case 404:
          setErrorMessage({errorCode:status, message: message || "Requested resource not found."});
          break;
        case 409:
          setErrorMessage({errorCode:status, message: message || "Conflict occurred. Please try again."});
          break;
        case 500:
          if (message.includes('duplicate')) {
            if (message.includes('email')) {
              setErrorMessage({errorCode:status, message: 'Email already exists'});
            }else if (message.includes('mobile')) {
              setErrorMessage({errorCode:status, message: 'Mobile already exists'});
            } else {
              setErrorMessage({errorCode:status, message: 'User already exists'});
            }
          }else{
            setErrorMessage({errorCode:status, message: "Server error. Please try again later."});
          }
          break;
        default:
          setErrorMessage({errorCode:status, message: message || "An unexpected error occurred."});
          break;
      }
    },[])

    const getLoggedInUser = useCallback(()=>{
      const prevUser = localStorage.getItem('user');
      const prevToken = localStorage.getItem('token');
      if (prevUser && prevToken) {
        setUser(JSON.parse(prevUser));
        setToken(prevToken)
        setIsLoggedIn(true);
      }
    },[])
    const signUpUser = async(userDetails)=>{
        console.log("User Data",userDetails);
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        try {
          const response = await axios.post(`${baseUrl}/api/users/signup`,{
            ...userDetails
          });
          const data = response.data;
          console.log(data);
          if (data.success) {
            return true
          }else{
            return false
          }
          
        } catch (error) {
          composeErrorMessage(error)
          console.log(error.response.data.errorCode+" : "+error.response.data.message);
          return false
        }
    }
    const signInUser = async(userCredentials)=>{
        console.log("User Credentials",userCredentials);
        const baseUrl = process.env.REACT_APP_BACKEND_URL;
        try {
          const response = await axios.post(`${baseUrl}/api/users/signin`,{
            ...userCredentials
          });
          const data = response.data;
          console.log(data);
          
          if (data.success) {
            setIsLoggedIn(true);
            setToken(data.token);
            setUser(data.user)
            // PENDING: Store necessary user data in local storage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return true;
          } else {
            return false;
          }
        } catch (error) {
          composeErrorMessage(error)
          console.log(error.response.data.errorCode+" : "+error.response.data.message);
          return false;
        }      
    }

    const logoutUser = ()=>{
      setIsLoggedIn(false);
      setToken('');
      setUser(null);
      localStorage.setItem('user', "");
      localStorage.setItem('token', "");
    }

    const handleOnChange = useCallback((e,index)=>{
      const {name, value} = e.target;
      setEmergencyContacts((prevContact)=>
        prevContact.map((contact,i)=>i===index?({...contact,[name]:value}):contact)
      )
    },[])

    const updateEmergencyContacts = useCallback(async()=>{
      try {
        const backendURL = process.env.REACT_APP_BACKEND_URL;
        const response = await axios.put(`${backendURL}/api/users/edit`,{
          emergencyContacts: emergencyContacts
        },{
          headers:{
            Authorization:token
          }
        })
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        composeErrorMessage(error)
        console.log(error.response?.data || error.message || error);
      }
    },[emergencyContacts, token, composeErrorMessage])
    return (
      <authContext.Provider
        value={{
          isLoggedIn,
          errorMessage, 
          setErrorMessage,
          composeErrorMessage,
          signUpUser,
          signInUser,
          token,
          user,
          logoutUser,
          getLoggedInUser,
          emergencyContacts,
          setEmergencyContacts,
          handleOnChange,
          updateEmergencyContacts
        }}
      >
        {children}
      </authContext.Provider>
    );
}