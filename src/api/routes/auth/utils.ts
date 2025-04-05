import { getModule } from "@/src/api/module";
import {
  AuthResult,
  AuthError,
  WeakCredentials,
  UserCollision,
} from "@/src/api/auth/AuthService";
import {
  JWTError,
  JWTExpired,
  JWTInvalid,
  TokenPayLoad,
} from "@/src/api/auth/JWTService";

export const buildRefreshTokenCookie = (token: string): string => {
  return [
    `refreshToken=${token}`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Strict`,
    `Path=/`,
    `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
  ].join("; ");
};

export const checkPasswordStrength = (password: string): boolean => {
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

export const validateEmail = (email: string): boolean => {
  const emailValid = /^[A-Za-z.0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  return emailValid;
};

// Check if the result is a TokenPayLoad (which has a userUid and userRole)
export function isTokenPayLoad(
  result: TokenPayLoad | JWTError
): result is TokenPayLoad {
  return (
    (result as TokenPayLoad).userUid !== undefined &&
    (result as TokenPayLoad).userRole !== undefined
  );
}

// Check if the result is an AuthResult (which has a userUid and userRole)
export function isAuthResult(
  result: AuthResult | AuthError
): result is AuthResult {
  return (
    (result as AuthResult).userUid !== undefined &&
    (result as AuthResult).userRole !== undefined
  );
}

// Check if the result is weak credentials (no userUid, userRole is missing)
export function isWeakCredentials(
  result: AuthResult | AuthError
): result is WeakCredentials {
  return (result as AuthError).message !== undefined; // Weak credentials should have an error message or specific property
}

// Check if the result is a UserCollision error (no userUid)
export function isUserCollision(
  result: AuthResult | AuthError
): result is UserCollision {
  return (result as AuthError).message === "User already exists"; // Assuming 'message' defines a user collision error
}

// Check if the result is an expired JWT (no userUid, specific expiry-related error)
export function isJWTExpired(
  result: TokenPayLoad | JWTError
): result is JWTExpired {
  return (result as JWTError).message === "Token expired"; // Assuming JWT error has a specific message indicating expiration
}

// Check if the result is an invalid JWT (no userUid, invalid token-related error)
export function isJWTInvalid(
  result: TokenPayLoad | JWTError
): result is JWTInvalid {
  return (result as JWTError).message === "Invalid token"; // Assuming JWT error has a specific message indicating invalidity
}

// Check if the result is any JWT error (doesn't have a userUid, and has a message or error-related property)
export function isJWTError(
  result: TokenPayLoad | JWTError
): result is JWTError {
  return (result as JWTError).message !== undefined;
} // Function to validate user profile fields (first name, last name, country, city, and phone number)

export const extractAccessToken = (req: Request): string | null => {
  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer (.+)$/);
  return match ? match[1] : null;
};

export const extractRefreshToken = (req: Request): string | null => {
  const cookies = req.headers.get("Cookie");
  if (!cookies) return null;
  const match = cookies.match(/refreshToken=([^;]+)/);
  return match ? match[1] : null;
};

export const validateUserProfile = (
  firstName: string,
  lastName: string,
  country: string,
  address: string,
  city: string,
  phoneNumber: string
): any => {
  const missingFields: string[] = [];
  const fieldErrors: string[] = [];

  // Check for missing fields
  if (!firstName) missingFields.push("First Name");
  if (!lastName) missingFields.push("Last Name");
  if (!country) missingFields.push("Country");
  if (!address) missingFields.push("Address");
  if (!city) missingFields.push("City");
  if (!phoneNumber) missingFields.push("Phone Number");

  // Field validation checks
  const isFirstNameValid = /^[A-Z a-z]+$/.test(firstName); // Only letters
  const isLastNameValid = /^[A-Za-z]+$/.test(lastName); // Only letters
  const isCountryValid = country.length > 0;
  const isCityValid = city.length > 0;
  const addressIsValid = address.length > 0;
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber);

  if (!isFirstNameValid) fieldErrors.push("First Name must only contain letters.");
  if (!isLastNameValid) fieldErrors.push("Last Name must only contain letters.");
  if (!isCountryValid) fieldErrors.push("Country cannot be empty.");
  if (!isCityValid) fieldErrors.push("City cannot be empty.");
  if (!addressIsValid) fieldErrors.push("Address cannot be empty.");
  if (!isPhoneNumberValid) fieldErrors.push("Phone Number is invalid.");

  const areValid = isFirstNameValid &&
    isLastNameValid &&
    addressIsValid &&
    isCountryValid &&
    isCityValid &&
    isPhoneNumberValid;

  return {
    missingFields, 
    fieldErrors,
    areValid
  };
};

// Phone number validation using a regex (example for international format)
export const validatePhoneNumber = (phoneNumber: string | null): boolean => {
  if (!phoneNumber) return false;
  const phoneRegex = /^\+?[0-9]\d{1,14}$/; // International format
  return phoneRegex.test(phoneNumber);
};

export const makeErrorResponse = (
  errorCode: number,
  message: string
): Response => {
  return new Response(
    JSON.stringify({
      type: "Error",
      message: message,
    }),
    { status: errorCode, headers: { "Content-Type": "application/json" } }
  );
};

export const makeSuccessResponse = (
  userUid: string,
  lastLogin: string,
  accessToken: string,
  refreshCookie: string
): Response => {
  return new Response(
    JSON.stringify({
      userUid: userUid,
      lastLogin: lastLogin,
      accessToken: accessToken,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": refreshCookie,
      },
    }
  );
};
