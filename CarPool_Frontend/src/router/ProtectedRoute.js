import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/authContext";

export function ProtectedRoute({children}){
    const {isLoggedIn}= useAuthContext();
    if (!isLoggedIn) {
        return <Navigate to={'/welcome'} replace={true}/>;
    }else{
        return children;
    }
}