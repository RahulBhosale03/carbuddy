import { RouterProvider } from 'react-router-dom';
import './App.css';
import { RideContextProvider } from './context/rideContext';
import { MapContextProvider } from './context/mapsContext';
import { browserRouter } from './router/browserRouter';
import {BookingContextProvider} from './context/bookingContext';
import { useAuthContext } from './context/authContext';
import { useEffect } from 'react';

function App() {
  const {getLoggedInUser} = useAuthContext();
  useEffect(()=>{
    getLoggedInUser();
  },[getLoggedInUser])
  return (
    <div className="App">
      {/*  */}
      <RideContextProvider>
        <BookingContextProvider>
          <MapContextProvider>
            <RouterProvider router={browserRouter} />
          </MapContextProvider>
        </BookingContextProvider>
      </RideContextProvider>
    </div>
  );
}

export default App;
