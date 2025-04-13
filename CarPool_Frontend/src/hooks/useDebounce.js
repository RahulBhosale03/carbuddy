import { useRef } from "react"

export function useDebounce(fn, delay){
    let id = useRef(null);
    const debouncefn = (...args)=>{
        if (id.current) {
            clearTimeout(id.current);
        }
        id.current = setTimeout(()=>{
            fn(...args);
        }, delay)
    }
    return debouncefn;
}