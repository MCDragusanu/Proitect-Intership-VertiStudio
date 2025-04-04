import { getModule } from "@/api/module";
import {
  AuthResult,
  AuthError,
  WeakCredentials,
  UserCollision,
} from "@/api/auth/AuthService";

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
  const emailValid = /^[A-Za-z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  return emailValid;
};

export function isAuthResult(
  result: AuthResult | AuthError
): result is AuthResult {
  return (result as AuthResult).userUid !== undefined;
}

export function isWeakCredentials(
  result: AuthResult | AuthError
): result is WeakCredentials {
  return (result as AuthResult).userUid !== undefined;
}

export function isUserCollision(
  result: AuthResult | AuthError
): result is UserCollision {
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
