const ENDPOINT_URL = "http://localhost:3000/api/auth/login";

export const login = async (email: string, password: string) => {
  const headers: Headers = new Headers();
  const requestBody = JSON.stringify({ userEmail: email, password: password });

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const requestInfo = new Request(ENDPOINT_URL, {
    method: "POST",
    headers: headers,
    body: requestBody,
  });

  try {
    const result = await fetch(requestInfo);

    if (result.ok) {
      const data = await result.json();
      const { userUid, lastLogin, accessToken } = data;
      return { userUid, lastLogin, accessToken, errorMessage: null };
    } else {
      const errorData = await result.json();
      return {
        userUid: null,
        lastLogin: null,
        accessToken: null,
        errorMessage:
          errorData.message || "An error occurred while trying to login",
      };
    }
  } catch (error: any) {
    console.log(`Login Error : ${error}`);
    // Catch any network or other unexpected errors
    return {
      userUid: null,
      lastLogin: null,
      accessToken: null,
      errorMessage: error.message || "An error occurred while trying to login",
    };
  }
};
