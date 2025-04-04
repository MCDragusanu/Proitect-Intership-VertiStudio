import { getModule } from "@/api/module";
import {
  AuthError,
  AuthResult,
  UserCollision,
  WeakCredentials,
} from "@/api/auth/AuthService";
import { TokenPayLoad } from "@/api/auth/JWTService";
import {
  checkPasswordStrength,
  validateEmail,
  validatePhoneNumber,
  isAuthResult,
  isWeakCredentials,
  buildRefreshTokenCookie,
  validateUserProfile,
  makeErrorResponse,
  makeSuccessResponse,
} from "./utils";
import UserCredentials from "@/shared/user_credentials";
import bcrypt from "bcrypt";
import UserProfile from "@/shared/user_profile";

// Main register handler
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
  } = await req.json();

  // Validate email
  if (!validateEmail(userEmail)) {
    return makeErrorResponse(400, "Invalid email format.");
  }

  // Validate password
  if (!checkPasswordStrength(password)) {
    return makeErrorResponse(400, "Password is too weak.");
  }

  // Validate profile fields
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
    return makeErrorResponse(
      400,
      "The user profile does not contain all required fields."
    );
  }

  let registerResult: AuthResult | AuthError;

  try {
    registerResult = await getModule().authService.registerUser(
      userEmail,
      password
    );
  } catch (error) {
    console.error("❌ Registration Error:", error);
    return makeErrorResponse(500, "An error occurred during registration.");
  }

  // Handle successful registration
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
    const now = new Date().toDateString();

    const credentials: UserCredentials = {
      user_uid: tokenPayload.userUid,
      user_role: "client",
      user_email: userEmail,
      hashed_password: await bcrypt.hash(password, 10),
      refresh_token: refreshToken,
      phone_number,
      last_login: now,
    };

    const profile: UserProfile = {
      user_uid: tokenPayload.userUid,
      first_name,
      last_name,
      country,
      address,
      city,
      account_creation_date: now,
    };

    await getModule().userRepository.insertCredentials(credentials);
    await getModule().userRepository.insertProfile(profile);

    const refreshCookie = buildRefreshTokenCookie(refreshToken);

    return makeSuccessResponse(
      tokenPayload.userUid,
      profile.account_creation_date,
      accessToken,
      refreshCookie
    );
  }

  // Handle weak password case
  if (registerResult instanceof UserCollision) {
    return makeErrorResponse(401, "Email is already in use!");
  } else if (registerResult instanceof WeakCredentials) {
    return makeErrorResponse(401, "Password is too weak!");
  }

  // Catch-all fallback
  return makeErrorResponse(
    500,
    "Unexpected error occurred while registering user."
  );
};
