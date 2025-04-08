import { useEffect } from "react";
export default function useIntervalEffect(callback: () => void, delayInSeconds: number) {
    useEffect(() => {
      const interval = setInterval(() => {
        callback();
      }, delayInSeconds * 1000); // convert seconds to ms
  
      return () => clearInterval(interval); // cleanup on unmount
    }, [callback, delayInSeconds]);
  }