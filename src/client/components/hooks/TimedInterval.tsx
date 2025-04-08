import { useEffect } from "react";
// Fixed useIntervalEffect hook
export const useIntervalEffect = (callback : ()=>void, delayInMilliseconds : number) => {
  useEffect(() => {
    const interval = setInterval(() => {
      callback();
      console.log("New Call")
    }, delayInMilliseconds);
    
    return () => clearInterval(interval); // cleanup on unmount
  }, [callback, delayInMilliseconds]);
};


