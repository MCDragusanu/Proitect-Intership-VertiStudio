import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import UserProfile from "@/src/shared/user_profile";

const ENDPOINT_URL = "http://localhost:3000/api/users";

/**
 * It returns the public profile by uid. No access token required.
 * @param userUid the uid of the user
 * @param errorCallback function to call in case of an error
 * @returns the user data if found, or null if an error occurs
 */
export const fetchUserInformation = async (
  userUid: string,
  accessToken: string,
  errorCallback: (message: string) => void,
  unAuthorizedAccess: (message: string) => void
): Promise<any> => {
  const headers: Headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const requestInfo = new Request(`${ENDPOINT_URL}/${userUid}`, {
    method: "GET",
    headers: headers,
  });

  try {
    const result = await fetch(requestInfo);

    if (result.ok) {
      const data = await result.json().catch((reason) => {console.log(reason)});
      const coins = Array.isArray(data.ownedCoins) ? data.ownedCoins : [];
      const profile = data.profile;
      const monetaryValue = data.monetaryValue;
      console.log("Success branch")
      return { profile, coins, monetaryValue };
    } else if (result.status === 403) {
      console.log("Restricted branch")
      unAuthorizedAccess("Trying to access a Restricted Resource!");
      return null;
    } else {
      console.log("Error branch")
      const errorData = await result.json().catch((err) => {
        console.error("Error parsing the response body:", err);
        return { message: "Unknown error occurred" };
      });

      errorCallback(errorData.message || "Unknown error occurred");
      return null;
    }
  } catch (error: any) {
    console.error("Error during fetch request:", error);
    errorCallback(error.message || "Network or unexpected error occurred");
    return null;
  }
};
