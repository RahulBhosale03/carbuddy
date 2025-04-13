import { createContext, useContext, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import axios from "axios";
import { useAuthContext } from "./authContext";

const mapsContext = createContext();
export const useMapContext = ()=>{
    const value = useContext(mapsContext);
    return value
}

export function MapContextProvider({children}){
    const [predictions, setPredictions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const {composeErrorMessage} = useAuthContext();
    const baseUrl = process.env.REACT_APP_BACKEND_URL;
    const searchPlace = useDebounce(async(place)=>{
        if (!place) {
            setPredictions([])
            return;
        }
        try {
            const response = await axios.get(`${baseUrl}/api/map/prediction`,{params:{
                input:place
            }})
            const data = response.data;
            if (data.success) {
                setPredictions(data.result.predictions)
            }
            
        } catch (error) {
            composeErrorMessage(error)
            console.log(error.response.data.message);
        }
    },1000);

    const handleOnChange = (e)=>{
        setSearchText(e.target.value);
        searchPlace(e.target.value);
    }

    const clear = ()=>{
        setSearchText('');
        setPredictions([]);
    }

    return <mapsContext.Provider value={{handleOnChange, searchText, predictions, clear}}>
        {children}
    </mapsContext.Provider>
} 