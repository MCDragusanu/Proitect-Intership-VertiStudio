import { fetchUserInformation } from "../../requrests/getUserInformation";
import { useState , useEffect } from "react";
import { toast } from "react-toastify";

function loadUserInformation(
    userUid: string,
    accessToken: string,
    errorCallback: (message: string) => void,
    unAuthorizedAccessCallback: (message: string) => void
  ) {
    return fetchUserInformation(
      userUid,
      accessToken,
      errorCallback,
      unAuthorizedAccessCallback
    );
  }
  
  
export   function useProfileInformation(
    userUid: string,
    accessToken: string,
    unAuthorizedAccessCallback: (message: string) => void
  ) {
    const [coins, setCoins] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>({});
    const [monetaryValue, setMonetaryValue] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    const onError = (error: Error) => {
      setError(error);
      setLoading(false);
      toast.error(`Error fetching data: ${error.message}`);
    };
  
    useEffect(() => {
      loadUserInformation(
        userUid,
        accessToken,
        (message) => {
          onError(new Error(message));
        },
        unAuthorizedAccessCallback
      )
        .then((data) => {
          setCoins(data.coins);
          setMonetaryValue(data.monetaryValue);
          setProfile(data.profile);
          setLoading(false);
        })
        .catch(onError);
    }, []);
  
    return { coins, profile, monetaryValue, loading, error };
  }