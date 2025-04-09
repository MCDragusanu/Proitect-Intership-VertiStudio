import { getModule } from "@/src/api/module";
import { AuthError, AuthResult } from "@/src/api/auth/AuthService";
import { TokenPayLoad } from "@/src/api/auth/JWTService";
import {
	buildRefreshTokenCookie,
	makeErrorResponse,
	makeSuccessResponse,
	validateEmail,
	isAuthResult,
} from "./utils";

export const login = async (req: Request): Promise<Response> => {
	const { userEmail, password } = await req.json();

	if (
		userEmail === null ||
		password === null ||
		password.length <= 0 ||
		!validateEmail(userEmail)
	) {
		return makeErrorResponse(400, "Invalid credentials provided!");
	}

	let loginResult;
	try {
		loginResult = await getModule().authService.loginUser(userEmail, password);
	} catch {
		return makeErrorResponse(400, "An error occurred during login");
	}

	//check if the result is success
	if (isAuthResult(loginResult)) {
		const tokenPayload: TokenPayLoad = {
			userUid: loginResult.userUid,
			userRole: loginResult.userRole,
		};

		try {
			//begin updating the credentials
			const credentials =
				await getModule().userRepository.getUserCredentialsByUid(
					tokenPayload.userUid,
				);

			if (!credentials) {
				return makeErrorResponse(
					400,
					"No credentials found! Need to create new account!",
				);
			}

			//create new tokens
			const accessToken =
				await getModule().jwtService.issueAccessToken(tokenPayload);
			const refreshToken =
				await getModule().jwtService.issueRefreshToken(tokenPayload);

			//update the fields
			credentials.last_login = loginResult.lastLogin;
			credentials.refresh_token = refreshToken;

			//update the token in the db
			await getModule().userRepository.updateCredentials(credentials);

			//make the token cookie
			const cookie = buildRefreshTokenCookie(refreshToken);
			//return the new response
			return makeSuccessResponse(accessToken, cookie);
		} catch (error: any) {
			console.log(`Error while logging in ${error}`);
			return makeErrorResponse(
				500,
				"An unexpected error occurred while logging in",
			);
		}
	}

	// AuthError
	if (loginResult instanceof AuthError) {
		return makeErrorResponse(400, " Please provide valid credentials!");
	}

	return makeErrorResponse(
		500,
		"An unexpected error occurred while logging in",
	);
};
