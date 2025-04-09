/**
 *Interface designated to handle auth actions of users
 */
interface AuthService {
	/**
	 * used to login the user
	 * @returns AuthResult if the action is SUCCESS
	 *@returns  AuthResult with the userUid on SUCCESS
	 * @returns  Invalid Credentials if no account is found that matches the credentials
	 */
	loginUser(
		userEmail: string,
		plainPassword: string,
	): Promise<AuthResult | AuthError>;

	/**
	 * used to Register the user
	 * @returns AuthResult if the action is SUCCESS
	 * @returns  UserCollision if the email is already in use
	 *  @returns  WeakCredentials if the password is to weak
	 */

	registerUser(
		userEmail: string,
		plainPassword: string,
	): Promise<AuthResult | AuthError>;

	/**
	 * Returns the password strenght requirements needed for registration(i.e minimum number of Digits , UpperCase and Special Characters  ,)
	 * @return PasswordRequirements instance with the required properties of the password
	 */
	getPasswordRequirements(): PasswordRequirements;
}
/**
 * Enum containg all the flags for the password requirments
 */
enum PasswordFlags {
	DigitCount,
	SpecialCharacterCount,
	MinimumLength,
	UpperCaseCharactersCount,
}

interface PasswordRequirements {
	digitCount: number;
	specialCharacterCount: number;
	minimumLength: number;
	upperCaseCharactersCount: number;
}

/**
 *Interface designated to standardized the return result of the Auth Service
 *@field userUid : the UUID of the account that has been logged In
 *@field lastLogin : the timestamp of the login
 */
interface AuthResult {
	userUid: string;
	lastLogin: string;
	userRole: "admin" | "client";
}

//Base class for all AuthErrors
class AuthError extends Error {
	constructor(message: string) {
		super(message);
	}
}

//Thrown when the credentials are not valid when logging
class InvalidCredentials extends AuthError {
	constructor(message: string) {
		super(message);
	}
}

//Thrown when the email is already In Use when registering
class UserCollision extends AuthError {
	constructor(message: string) {
		super(message);
	}
}

//Thrown when no user is found
class UserNotFound extends AuthError {
	constructor(message: string) {
		super(message);
	}
}

//Thrown if the password is too weak
class WeakCredentials extends AuthError {
	public failedRequirements: Array<PasswordFlags>;
	constructor(message: string, flags: Array<PasswordFlags>) {
		super(message);
		this.failedRequirements = flags;
	}
}
export {
	AuthResult,
	AuthService,
	AuthError,
	InvalidCredentials,
	UserCollision,
	UserNotFound,
	WeakCredentials,
	PasswordRequirements,
	PasswordFlags,
};
