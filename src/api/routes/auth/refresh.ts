import { getModule } from "@/api/module";
import {
  JWTExpired,
  JWTInvalid,
  JWTError,
  TokenPayLoad,
} from "@/api/auth/JWTService";
import {
  buildRefreshTokenCookie,
  makeErrorResponse,
  makeSuccessResponse,
  isTokenPayLoad,
  extractAccessToken,
  extractRefreshToken,
} from "./utils";

export const refreshAccessToken = async (req: Request): Promise<Response> => {
  // Extract tokens from request headers (assuming these will come from the Bearer header)
  const accessToken = extractAccessToken(req); // Should be retrieved from the Bearer header
  const refreshToken = extractRefreshToken(req); // Should be retrieved from cookies or headers

  // Validate the presence of tokens
  if (!accessToken) {
    return makeErrorResponse(400, "Invalid Request. Access token is required.");
  }

  if (!refreshToken) {
    return makeErrorResponse(400, "Invalid Request. No refresh token found.");
  }

  // Extract the payload from the refresh token
  const refreshTokenResult =
    await getModule().jwtService.extractPayloadFromRefreshToken(refreshToken);

  const accessTokenResult =
    await getModule().jwtService.extractPayloadFromAccessToken(accessToken);

  // Handle expired refresh token
  if (refreshTokenResult instanceof JWTExpired) {
    const credentials =
      await getModule().userRepository.getUserCredentialsByToken(refreshToken);
    if (credentials != null) {
      credentials.refresh_token = null;
      getModule().userRepository.updateCredentials(credentials);
    }
    return makeErrorResponse(400, "Session expired. You must re-authenticate.");
  }

  // Handle invalid refresh token
  else if (refreshTokenResult instanceof JWTInvalid) {
    return makeErrorResponse(
      400,
      "Session invalid. Please register or log in."
    );
  } else {
    const payload = refreshTokenResult as TokenPayLoad;
    const credentials =
      await getModule().userRepository.getUserCredentialsByToken(refreshToken);

    if (credentials === null) {
      return makeErrorResponse(
        500,
        "Failed to update refresh Token. Credentials not found!"
      );
    }

    // Check if the access token is invalid or tampered with
    if (accessTokenResult instanceof JWTInvalid) {
      console.log("*************** Warning **************");
      console.log(
        "Access token for user has been tampered. Possible malicious activity. Refresh Token will be revoked!"
      );
      // Remove the refresh token from the user's credentials as a security measure
      credentials.refresh_token = null;
      await getModule().userRepository.updateCredentials(credentials);

      // Return an error response for security reasons
      return makeErrorResponse(
        400,
        "Access token has been tampered with. Please log in again."
      );
    }

    // Issue a new access token
    const newAccessToken = await getModule().jwtService.issueAccessToken(
      payload
    );

    // Build the refresh token cookie
    const cookie = buildRefreshTokenCookie(refreshToken);

    // Return success response with new tokens and user info
    return makeSuccessResponse(
      payload.userUid,
      credentials.last_login
        ? credentials.last_login
        : new Date().toDateString(),
      newAccessToken,
      cookie
    );
  }
};
