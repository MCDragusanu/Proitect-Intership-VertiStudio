const ENDPOINT_URL = "http://localhost:3000/api/auth/register";

export const register = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  country: string,
  city: string,
  phoneNumber: string,
  address: string
) => {
  const headers: Headers = new Headers();
  const requestBody = JSON.stringify({
    userEmail: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    country: country,
    city: city,
    phone_number: phoneNumber,
    address: address,
  });

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

      // Check if the error data contains specific field errors
      if (errorData && errorData.errors) {
        // Assuming the error data contains an array of field errors (e.g., ["Email is invalid", "Phone number is missing"])
        const fieldErrors = errorData.errors.join(", "); // Join the errors for readability

        return {
          userUid: null,
          lastLogin: null,
          accessToken: null,
          errorMessage: `The following fields are invalid: ${fieldErrors}`,
        };
      }

      // Handle generic error message (e.g., "Internal server error")
      return {
        userUid: null,
        lastLogin: null,
        accessToken: null,
        errorMessage:
          errorData.message || "An error occurred while trying to register",
      };
    }
  } catch (error: any) {
    console.log(`Register Error : ${error}`);

    return {
      errorMessage:
        error.message || "An error occurred while trying to register",
    };
  }
};
