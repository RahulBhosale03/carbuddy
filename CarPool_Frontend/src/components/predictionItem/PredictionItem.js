import { useNavigate } from 'react-router-dom';
import styles from './predictionItem.module.css';
import { useRideContext } from '../../context/rideContext';
import { useMapContext } from '../../context/mapsContext';
export default function PredictionItem({prediction, type}){
    const {clear} = useMapContext();
    const {searchData, setSearchData,publishData, setPublishData} = useRideContext();
    const navigate = useNavigate();
    const handleOnClick = (e)=>{
        if (type==='searchOrigin') {
            setSearchData({...searchData, from: prediction.mainText})
            navigate(-1)
        } else if(type==='searchDestination'){
            setSearchData({...searchData, to: prediction.mainText})
            navigate(-1)
        }else if (type==='publishOrigin') {
            setPublishData({...publishData, origin:prediction.mainText, originId: prediction.place_id})
            navigate(-1)
        }else if (type==='publishDestination') {
            setPublishData({...publishData, destination:prediction.mainText, destinationId: prediction.place_id})
            navigate(-1)
        }else{
            return
        }
        clear();
    }
    return <div className={styles.predictionItem} onClick={handleOnClick}>
        <div className={styles.placeName}>{prediction.mainText}</div>
        <div className={styles.placeDescription}>{prediction.description}</div>
    </div>
}