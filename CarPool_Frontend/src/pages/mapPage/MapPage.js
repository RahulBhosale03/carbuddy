import { useCallback, useEffect, useState } from 'react';
import styles from './mapPage.module.css';
import { useRideContext } from './../../context/rideContext'
import { socket } from '../../socket/socket';
import {useAuthContext} from './../../context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript, DirectionsRenderer, MarkerClusterer } from '@react-google-maps/api';
import Alert from '../../components/alert/Alert';
export default function MapPage() {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })
    const navigate = useNavigate();
    const {rideId} = useParams();
    const {fetchRideDetails, rideDetails} = useRideContext();
    const {user, errorMessage} = useAuthContext();
    const [location, setLocation] = useState({lat: 0, lng: 0});
    const [otherLocations, setOtherLocations] = useState([]);
    const [route, setRoute] = useState(null);

    useEffect(()=>{
      fetchRideDetails(rideId);
  },[fetchRideDetails, rideId]);

    // Emit/send updated coords to server with roomId
    const refreshLocation = useCallback(({lat, lng})=>{
      if(!rideDetails || !rideDetails._id)return
      socket.emit('locationUpdate', {rideId: rideDetails._id, lat: lat, lng: lng, name:user.name})
    },[rideDetails, user])

    // Join Room related to specific ride on page load;
    useEffect(()=>{
      if(!rideDetails || !rideDetails._id)return
        socket.emit('joinRoom', rideDetails._id)

        return ()=>{
          socket.emit('leaveRoom', rideDetails._id)
        }
    },[rideDetails])

    // Emit/send location to all users again when new user joins the room/ride
    useEffect(()=>{
      const handleNewUserJoined = ()=>{
        // console.log('new user joined');
        refreshLocation(location);
      }
      socket.on('newUserJoined', handleNewUserJoined);

      return ()=>{
        socket.off('newUserJoined', handleNewUserJoined)
      }
    },[location, refreshLocation])

    // Track live location of user
    useEffect(()=>{
        // console.log('Rerender');
        
        if (navigator.geolocation) {
            // Watch position of user continuously.
            const watchId = navigator.geolocation.watchPosition((position)=>{
                const {latitude, longitude} = position.coords;
                // Refresh location only when lat-lng are changed
                setLocation((prev)=>{
                  if (prev.lat !== latitude || prev.lng !== longitude || prev.lat === 0 || prev.lng === 0) {
                    refreshLocation({lat: latitude, lng: longitude})
                    return {lat: latitude, lng: longitude}
                  }
                  return prev
                })
            },(error)=>{
                console.log("Error while watching position", error);
            })
            // Clear Up watchPostion
            return (()=>{navigator.geolocation.clearWatch(watchId)})
        }
    },[refreshLocation]);

    // Update location of other users
    useEffect(()=>{
        socket.on('newLocation', ({id, lat, lng, name})=>{
            // Set locations of every user except own in otherLocations array
            setOtherLocations((prev)=>[...prev.filter(loc=>loc.id!==id),{id, lat, lng, name}])
            // console.log(`Current name: ${user.name}, Received Name: ${name}`);
        })

        return ()=>{
          socket.off('newLocation')
        }
    },[user])

    // Remove user from otherLocations array
    useEffect(()=>{
      socket.on('removeUser', ({id})=>{
        setOtherLocations((prev)=>[...prev.filter(loc=>loc.id!==id)])
      })
    },[])

    // Fetch directions from directionService
    useEffect(()=>{
      if(!rideDetails)return
      if (isLoaded && window.google) {
        const fetchDirection = () => {
          const directionService = new window.google.maps.DirectionsService();
          directionService.route({
            origin: rideDetails.endLocation.coordinates,
            destination: rideDetails.startLocation.coordinates,
            // waypoints:[{location: {lat:18.7617005, lng: 73.8625981}, stopover: true}],
            travelMode: window.google.maps.TravelMode.DRIVING
          },(response,status)=>{
            if (status===window.google.maps.DirectionsStatus.OK) {
              // console.log('Directions fetched', response);
              setRoute(response)
            }
          })
        };
        fetchDirection();
      }
      
    },[isLoaded, rideDetails])

    const goBack = useCallback(()=>{
        navigate(-1);
    },[navigate])
    
    return (
      <div className={styles.main}>
        {errorMessage?.message && <Alert navigate={navigate}/>}
        <div className={styles.header}>
          <button onClick={goBack} className={styles.backButton}>
            <i className={`fi fi-sr-angle-left ${styles.icon}`}></i>
          </button>
          <div className={styles.pageHead}>Map</div>
        </div>
        {isLoaded ? (
          <div className={styles.mapContainer}>
            <GoogleMap
              center={location}
              zoom={10}
              mapContainerClassName= {styles.map}
              options={{
                fullscreenControl: false,
                mapTypeControl: false
              }}
            >
              {/* Marker for own location */}
              <MarkerClusterer>
                {(clusterer) => {
                  return (
                    <>
                      <Marker
                        position={location}
                        icon={{
                          url: "https://cdn-icons-png.flaticon.com/128/18292/18292370.png",
                          scaledSize: new window.google.maps.Size(32, 32),
                        }}
                        label={{
                          text: "You",
                          color: "black",
                          fontSize: "18px",
                          className: styles.markerLabel,
                        }}
                        clusterer={clusterer}
                      />
                      {/* Markers for location of all connected users */}
                      {otherLocations.map((loc) => (
                        <Marker
                          key={loc.id}
                          position={{ lat: loc.lat, lng: loc.lng }}
                          icon={{
                            url: "https://cdn-icons-png.flaticon.com/128/18292/18292370.png",
                            scaledSize: new window.google.maps.Size(32, 32),
                          }}
                          label={{
                            text: loc.name,
                            color: "black",
                            fontSize: "18px",
                            className: styles.markerLabel,
                          }}
                          clusterer={clusterer}
                        />
                      ))}
                    </>
                  );
                }}
              </MarkerClusterer>

              {/* Direction renderer to display direction on map */}
              {route && (
                <DirectionsRenderer directions={route}></DirectionsRenderer>
              )}
            </GoogleMap>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
}