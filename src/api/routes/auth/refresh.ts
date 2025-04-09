import { getModule } from "../../module";
import {
	JWTExpired,
	JWTInvalid,
	TokenPayLoad,
} from "@/src/api/auth/JWTService";
import {
	buildRefreshTokenCookie,
	makeErrorResponse,
	makeSuccessResponse,
	isTokenPayLoad,
	extractAccessToken,
	extractRefreshToken,
} from "./utils";

export const refreshAccessToken = async (req: Request): Promise<Response> => {
	const refreshToken = extractRefreshToken(req); // Should be retrieved from cookies or headers

	if (!refreshToken) {
		return makeErrorResponse(400, "Invalid Request. No refresh token found.");
	}

	// Extract the payload from the refresh token
	const refreshTokenResult =
		await getModule().jwtService.extractPayloadFromRefreshToken(refreshToken);

	// Handle invalid refresh token
	if (refreshTokenResult instanceof JWTInvalid) {
		console.log("Refresh Token Invalid");
		return makeErrorResponse(
			403,
			"Session invalid. Please register or log in.",
		);
	}

	// Handle expired refresh token
	else if (refreshTokenResult instanceof JWTExpired) {
		console.log("Refresh Token Expired");
		const credentials =
			await getModule().userRepository.getUserCredentialsByToken(refreshToken);
		if (credentials != null) {
			credentials.refresh_token = null;
			getModule().userRepository.updateCredentials(credentials);
		}
		return makeErrorResponse(403, "Session expired. You must re-authenticate.");
	}
	//handle the token is valid
	else {
		console.log("Token is valid");
		const payload = refreshTokenResult as TokenPayLoad;
		const credentials =
			await getModule().userRepository.getUserCredentialsByToken(refreshToken);

		if (credentials === null) {
			console.log("No credentials linked!");
			return makeErrorResponse(
				500,
				"Failed to update refresh Token. Credentials not found!",
			);
		}

		// Issue a new access token
		const newAccessToken =
			await getModule().jwtService.issueAccessToken(payload);

		// Build the refresh token cookie
		const cookie = buildRefreshTokenCookie(refreshToken);

		console.log("New access token issued");
		// Return success response with new tokens and user info
		return makeSuccessResponse(newAccessToken, cookie);
	}
};
