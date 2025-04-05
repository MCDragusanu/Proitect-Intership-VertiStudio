import UserProfile from "@/src/shared/user_profile";

const ENDPOINT_URL = "http://localhost:3000/api/profile/";

/**
 * It returns the public profile by uid. No access token required.
 * @param userUid the uid of the user
 * @param errorCallback function to call in case of an error
 * @returns the user profile if found, or null if an error occurs
 */
export const getUserProfile = async (
  userUid: string,
  errorCallback: (message: string) => void
): Promise<UserProfile | null> => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const requestInfo = new Request(`${ENDPOINT_URL}${userUid}`, {
    method: "GET",
    headers: headers,
  });

  try {
    const result = await fetch(requestInfo);

    if (result.ok) {
      const data = await result.json();

      const userProfile: UserProfile = data;
      return userProfile;
    }

    const errorData = await result.json().catch((err) => {
      console.error("Error parsing the response body:", err);
      return { message: "Unknown error occurred" }; // Provide a fallback message
    });

    errorCallback(errorData.message || "Unknown error occurred");
    return null;
  } catch (error: any) {
    console.error("Error during fetch request:", error);
    errorCallback(error.message || "Network or unexpected error occurred");
    return null;
  }
};
