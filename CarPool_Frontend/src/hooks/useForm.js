import { useState } from "react";

export function useForm(initialState) {
    const [formData, setFormData] = useState(initialState);
    const handleOnChange = (e)=>{
        const {id, value} = e.target;
        setFormData({...formData,[id]:value});
    }
    return [formData, handleOnChange];
}