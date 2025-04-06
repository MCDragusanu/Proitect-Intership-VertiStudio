const ENDPOINT_URL = "http://localhost:3000/api/auth/refresh";

export const RefreshTokens = async (accessToken: string) => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${accessToken}`);
  const requestInfo = new Request(ENDPOINT_URL, {
    method: "POST",
    headers: headers,
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
          errorData.message || "You must login in order to continue",
      };
    }
  } catch (error: any) {
    console.log(`Register Error : ${error}`);

    return {
      userUid: null,
      lastLogin: null,
      accessToken: null,
      errorMessage: error.message || "You must login in order to continue",
    };
  }
};
