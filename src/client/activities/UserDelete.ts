import UserCredentials from "@/shared/user_credentials";

const ENDPOINT_URL = "http://localhost:3000/api/auth/delete/";

/**
 * It deletes the user, only public profile will remain.Access token required,it is a protected action.
 * @param userUid the uid of the user
 * @param accessToken the accessToken linked to it
 * @param errorCallback invoked in case of error
 * @param unAuthorizedAccess invoked if the access is unauthorized (e.g., token expired or invalid)
 */
export const deleteUser = async (
  userUid: string,
  accessToken: string,
  errorCallback: (message: string) => void,
  unAuthorizedAccess: (message: string) => void
): Promise<void> => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);

  const requestInfo = new Request(`${ENDPOINT_URL}${userUid}`, {
    method: "DELETE",
    headers: headers,
  });

  try {
    const result = await fetch(requestInfo);

    // Unauthorized (e.g., token expired or invalid)
    if (result.status === 401) {
      unAuthorizedAccess("Trying to perform a Restricted action!");
      return;
    }

    const errorData = await result.json().catch((err) => {
      console.error("Error parsing response body:", err);
      return;
    });
    errorCallback(errorData.message || "Unknown error occurred");
  } catch (error: any) {
    // Handle any network or unexpected errors
    console.error(`Error during fetch request: ${error}`);
    errorCallback(error.message || "Network or unexpected error occurred");
  }
};
