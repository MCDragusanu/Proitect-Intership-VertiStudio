import { getModule } from "@/src/api/module";
import {
	AuthError,
	AuthResult,
	UserCollision,
	WeakCredentials,
} from "@/src/api/auth/AuthService";
import { TokenPayLoad } from "@/src/api/auth/JWTService";
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
import UserCredentials from "@/src/shared/user_credentials";
import bcrypt from "bcrypt";
import UserProfile from "@/src/shared/user_profile";

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

	console.log("Beginning registration!");
	// Validate email
	if (!validateEmail(userEmail)) {
		return makeErrorResponse(400, "Invalid email format.");
	}

	// Validate password
	if (!checkPasswordStrength(password)) {
		return makeErrorResponse(400, "Password is too weak.");
	}

	const profileCheck = validateUserProfile(
		first_name,
		last_name,
		country,
		address,
		city,
		phone_number,
	);

	// If there are missing fields or invalid fields, build the error message
	if (profileCheck.missingFields.length > 0 || !profileCheck.areValid) {
		console.log(profileCheck);

		// Build error message for missing fields
		let errorMessage = "";
		if (profileCheck.missingFields.length > 0) {
			errorMessage += `The following fields are missing: ${profileCheck.missingFields.join(", ")}. `;
		}

		// Build error message for invalid fields
		if (profileCheck.fieldErrors.length > 0) {
			errorMessage += `The following fields have errors: ${profileCheck.fieldErrors.join(", ")}.`;
		}

		console.log(errorMessage);

		return makeErrorResponse(400, errorMessage);
	}
	console.log("Registration request body is good!");
	let registerResult: AuthResult | AuthError;

	try {
		registerResult = await getModule().authService.registerUser(
			userEmail,
			password,
		);
	} catch (error) {
		console.error("❌ Registration Error:", error);
		return makeErrorResponse(500, "An error occurred during registration.");
	}

	// Handle successful registration
	if (isAuthResult(registerResult)) {
		console.log("Registration success");

		const tokenPayload: TokenPayLoad = {
			userUid: registerResult.userUid,
			userRole: registerResult.userRole,
		};

		const accessToken =
			await getModule().jwtService.issueAccessToken(tokenPayload);
		const refreshToken =
			await getModule().jwtService.issueRefreshToken(tokenPayload);
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
			name: first_name + " " + last_name,
			country,
			address,
			city,
			account_creation_date: now,
		};

		const credentialsResult =
			await getModule().userRepository.insertCredentials(credentials);
		const profileResult =
			await getModule().userRepository.insertProfile(profile);
		console.log(
			`Credentials Status : ${credentialsResult} Profile : ${profileResult}`,
		);
		const refreshCookie = buildRefreshTokenCookie(refreshToken);

		return makeSuccessResponse(accessToken, refreshCookie);
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
		"Unexpected error occurred while registering user.",
	);
};
