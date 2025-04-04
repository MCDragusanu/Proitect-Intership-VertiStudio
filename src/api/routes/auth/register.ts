import { getModule } from "@/api/module";
import { AuthError, AuthResult, WeakCredentials } from "@/api/auth/AuthService";
import { TokenPayLoad } from "@/api/auth/JWTService";

import UserCredentials from "@/shared/user_credentials";
import bcrypt from "bcrypt";
import UserProfile from "@/shared/user_profile";

const validateEmail = (email: string): boolean => {
  const emailValid = /^[A-Za-z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  return emailValid;
};

const validatePassword = (password: string): boolean => {
  const requirements = getModule().authService.getPasswordRequirements();
  const digitCount =
    [...password.matchAll(RegExp(/\d/g))].length === requirements.digitCount;
  const specialCharacters =
    [...password.matchAll(RegExp(/\W/g))].length ===
    requirements.specialCharacterCount;
  const upperCaseCharactersCount =
    [...password.matchAll(RegExp(/[A-Z]/g))].length ===
    requirements.upperCaseCharactersCount;
  const length = password.length >= requirements.minimumLength;

  return digitCount && specialCharacters && upperCaseCharactersCount && length;
};
function isAuthResult(result: AuthResult | AuthError): result is AuthResult {
  return (result as AuthResult).userUid !== undefined;
}

function isWeakCredentials(
  result: AuthResult | AuthError
): result is WeakCredentials {
  return (result as AuthResult).userUid !== undefined;
}
// Function to validate user profile fields (first name, last name, country, city, and phone number)
export const validateUserProfile = (
  firstName: string,
  lastName: string,
  country: string,
  adress: string,
  city: string,
  phoneNumber: string
): boolean => {
  const isFirstNameValid = /^[A-Za-z]+$/.test(firstName); // Only letters
  const isLastNameValid = /^[A-Za-z]+$/.test(lastName); // Only letters
  const isCountryValid = country.length > 0;
  const isCityValid = city.length > 0;
  const adressIsValid = adress.length > 0;
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

  return (
    isFirstNameValid &&
    isLastNameValid &&
    adressIsValid &&
    isCountryValid &&
    isCityValid &&
    isPhoneNumberValid
  );
};

// Phone number validation using a regex (example for international format)
export const validatePhoneNumber = (phoneNumber: string | null): boolean => {
  if (!phoneNumber) return false;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // International format
  return phoneRegex.test(phoneNumber);
};

// Register function for Bun (with Response)
export const register = async (req: Request): Promise<Response> => {
  const {
    userEmail,
    password,
    first_name,
    address,
    last_name,
    country,
    city,
    phone_number,
  } = await req.json(); // Parse JSON body

  // Validate email and password
  if (!validateEmail(userEmail)) {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "Invalid email format.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!validatePassword(password)) {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "Password is too weak",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  //validate the profile fields
  if (
    !validateUserProfile(
      first_name,
      last_name,
      country,
      address,
      city,
      phone_number
    )
  ) {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "Invalid user profile data.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  let registerResult;
  try {
    registerResult = await getModule().authService.registerUser(
      userEmail,
      password
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(
      JSON.stringify({
        type: "Error",
        message: "An error occurred during registration.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (isAuthResult(registerResult)) {
    const tokenPayload: TokenPayLoad = {
      userUid: registerResult.userUid,
      userRole: registerResult.userRole,
    };

    const accessToken = await getModule().jwtService.issueAccessToken(
      tokenPayload
    );
    const refreshToken = await getModule().jwtService.issueRefreshToken(
      tokenPayload
    );

    const credentials: UserCredentials = {
      user_uid: tokenPayload.userUid,
      user_role: "client",
      user_email: userEmail,
      hashed_password: await bcrypt.hash(password, 10),
      refresh_token: refreshToken,
      phone_number: phone_number,
      last_login: new Date().toDateString(),
    };

    const profile: UserProfile = {
      user_uid: tokenPayload.userUid,
      first_name: first_name,
      last_name: last_name,
      country: country,
      adress: address,
      city: city,
      account_creation_date: credentials.last_login
        ? credentials.last_login
        : new Date().toDateString(),
    };

    await getModule().userRepository.insertCredentials(credentials);
    await getModule().userRepository.insertProfile(profile);

    return new Response(
      JSON.stringify({
        userUid: registerResult.userUid,
        lastLogin: registerResult.lastLogin,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Handle AuthError
  if (registerResult instanceof WeakCredentials) {
    return new Response(
      JSON.stringify({
        type: "Error",
        message: registerResult.message || "Registration failed.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // If none of the above, return a generic error (although this shouldn't happen)
  return new Response(
    JSON.stringify({
      type: "Error",
      message: "Unexpected error occurred.",
    }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
};
