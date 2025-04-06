const ENDPOINT_URL = "http://localhost:3000/api/auth/refresh";

interface RefreshTokenResponse {
  userUid: string | null;
  lastLogin: string | null;
  accessToken: string | null;
  errorMessage?: string;
}

export const RefreshTokens = async (accessToken: string): Promise<RefreshTokenResponse> => {
  // Set up the request headers
  const headers = new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  });

  try {
    const response = await fetch(ENDPOINT_URL, { method: "POST", headers });
    console.log("Refresh Result")
    console.log(response)
    if (!response.ok) {
      // If response is not OK, try to extract error message from response body
      const errorData = await response.json();
      return {
        userUid: null,
        lastLogin: null,
        accessToken: null,
        errorMessage: errorData.message || "You must log in to continue.",
      };
    }

    // If the response is successful, parse the response body and return the required data
    const data = await response.json();
    const { userUid, lastLogin, accessToken: newAccessToken } = data;

    return {
      userUid,
      lastLogin,
      accessToken: newAccessToken,
      errorMessage: "", // No error message if successful
    };
  } catch (error: any) {
    console.error("Error during token refresh:", error);
    return {
      userUid: null,
      lastLogin: null,
      accessToken: null,
      errorMessage: error.message || "An error occurred while refreshing the token.",
    };
  }
};
