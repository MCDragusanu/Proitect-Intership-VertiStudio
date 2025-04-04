import UserCredentials from "@/shared/user_credentials";

const ENDPOINT_URL = "http://localhost:3000/api/profile/";

/**
 * It returns the credentials of the uid. Access token required , it is a protected resource.
 * @param userUid the uid of the user
 * @param accessToken the accessToken linked to it
 * @param errorCallback invoked in case of error
 * @param unAuthorizedAccess invoked if the access is unauthorized (e.g., token expired or invalid)
 * @returns The credentials of the user if it is authorized, otherwise null
 */
export const getUserCredentials = async (
  userUid: string,
  accessToken: string,
  errorCallback: (message: string) => void,
  unAuthorizedAccess: (message: string) => void
): Promise<UserCredentials | null> => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  const requestInfo = new Request(`${ENDPOINT_URL}${userUid}`, {
    method: "GET",
    headers: headers,
  });

  try {
    const result = await fetch(requestInfo);

    if (result.ok) {
      const data = await result.json();

      const userCredentials: UserCredentials = data;
      return userCredentials;
    }

    // Unauthorized (e.g., token expired or invalid)
    if (result.status === 401) {
      unAuthorizedAccess("Trying to access a Restricted Resource!");
      return null;
    }

    const errorData = await result.json().catch((err) => {
      console.error("Error parsing response body:", err);
      return { message: "Unknown error occurred" };
    });
    errorCallback(errorData.message || "Unknown error occurred");
    return null;
  } catch (error: any) {
    // Handle any network or unexpected errors
    console.error(`Error during fetch request: ${error}`);
    errorCallback(error.message || "Network or unexpected error occurred");
    return null;
  }
};
