const ENDPOINT_URL = "http://localhost:3000/api/auth/refresh";

interface RefreshTokenResponse {
  userUid: string | null;
  lastLogin: string | null;
  accessToken: string | null;
  errorMessage?: string;
}

export const fetchAccessToken = async (
  onRefresh: (token : string) => void,
  onExpired: (message : string) => void,
  onError: (error: any) => void
) => {
  // Set up the request headers
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  const requestInfo = new Request(ENDPOINT_URL, {
    method: "POST",
    headers: headers,
  });

  fetch(requestInfo)
    .catch((error) => {
      console.log(error);
      onError(error);
    })
    .then(async (result) => {
      if (result instanceof Response) {
        //check to see if it has been refreshed
        if (result.ok) {
          const responseBody = await result.json().catch((reason)=>{console.log(reason);onError(reason)});
          const accessToken = responseBody.accessToken;
          console.log(responseBody)
          onRefresh(accessToken);
        } //error code for expired or invalid
        else if (result.status === 403) {
          console.log("Action Forbidden");
          onExpired("Failed to refresh access token!");
        } else onError("Failed to refresh the access token");
      }
    });
};
