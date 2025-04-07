const ENDPOINT_URL = "http://localhost:3000/api/auth/login";

export const login = async (email: string, password: string) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  const requestBody = JSON.stringify({ userEmail: email, password });

  const requestInfo = new Request(ENDPOINT_URL, {
    method: "POST",
    headers,
    body: requestBody,
  });

  try {
    const result = await fetch(requestInfo);

    const data = await result.json();

    if (result.ok) {
      console.log(data)
      const { accessToken } = data;
      return { accessToken, errorMessage: null };
    } else {
      return {
        accessToken: null,
        errorMessage: data.message || "An error occurred while trying to login",
      };
    }
  } catch (error: unknown) {
    console.log(`Login Error:`, error);
    return {
      accessToken: null,
      errorMessage:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
};
