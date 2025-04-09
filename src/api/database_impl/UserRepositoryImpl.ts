import UserCredentials from "@/src/shared/user_credentials";
import UserProfile from "@/src/shared/user_profile";
import UserRepository from "../database/UserRepository";
import { SQLiteUserCredentialsDao } from "./UserCredentialsDaoImpl";
import { SQLiteUserProfileDao } from "./UserProfileDaoImpl";

export class SQLLiteUserRepository implements UserRepository {
	private userCredentialsDao: SQLiteUserCredentialsDao;
	private userProfileDao: SQLiteUserProfileDao;

	constructor(
		credentialsDao: SQLiteUserCredentialsDao,
		profileDao: SQLiteUserProfileDao,
	) {
		this.userCredentialsDao = credentialsDao;
		this.userProfileDao = profileDao;
	}

	async insertCredentials(credentials: UserCredentials): Promise<boolean> {
		let success: boolean = false;
		try {
			success =
				await this.userCredentialsDao.insertUserCredentials(credentials);
			// console.log(`Credentials Inserted : ${credentials}`)
			return success;
		} catch (err: any) {
			console.error(`Error inserting credentials: ${err}`);
			return false;
		} finally {
			console.log(
				`[Credentials] Inserted user with email: ${credentials.user_email} - Success: ${success}`,
			);
		}
	}
	async updateRefreshToken(
		userUid: string,
		token: string | null,
	): Promise<boolean> {
		let success: boolean = false;
		try {
			success = await this.userCredentialsDao.updateRefreshToken(
				userUid,
				token,
			);
			return success;
		} catch (err: any) {
			console.error(`Error updating refresh token: ${err}`);
			return false;
		} finally {
			// console.log(`[Credentials] Updated refresh token for UID: ${userUid} - Success: ${success}`);
		}
	}
	async insertProfile(profile: UserProfile): Promise<boolean> {
		let success: boolean = false;
		try {
			success = await this.userProfileDao.insertUserProfile(profile);
			return success;
		} catch (err: any) {
			console.error(`Error inserting user profile: ${err}`);
			return false;
		} finally {
			//console.log(`[Profile] Inserted user with UID: ${profile.user_uid} - Success: ${success}`);
		}
	}

	async updateCredentials(credentials: UserCredentials): Promise<boolean> {
		let success: boolean = false;
		try {
			success =
				await this.userCredentialsDao.updateUserCredentials(credentials);
			return success;
		} catch (err: any) {
			console.error(`Error updating user credentials: ${err}`);
			return false;
		} finally {
			console.log(
				`[Credentials] Updated user with email: ${credentials.user_email} - Success: ${success}`,
			);
		}
	}

	async updateProfile(profile: UserProfile): Promise<boolean> {
		let success: boolean = false;
		try {
			success = await this.userProfileDao.updateUserProfile(profile);
			return success;
		} catch (err: any) {
			console.error(`Error updating user profile: ${err}`);
			return false;
		} finally {
			// console.log(`[Profile] Updated user with UID: ${profile.user_uid} - Success: ${success}`);
		}
	}

	async deleteCredentialsByEmail(userEmail: string): Promise<boolean> {
		let success: boolean = false;
		try {
			success =
				await this.userCredentialsDao.deleteUserCredentialsByEmail(userEmail);
			return success;
		} catch (err: any) {
			console.error(`Error deleting user credentials by email: ${err}`);
			return false;
		} finally {
			//console.log(`[Credentials] Deleted user with email: ${userEmail} - Success: ${success}`);
		}
	}

	async deleteCredentialsByUid(userUid: string): Promise<boolean> {
		let success: boolean = false;
		try {
			success =
				await this.userCredentialsDao.deleteUserCredentialsByUid(userUid);
			return success;
		} catch (err: any) {
			console.error(`Error deleting user credentials by UID: ${err}`);
			return false;
		} finally {
			//console.log(`[Credentials] Deleted user with UID: ${userUid} - Success: ${success}`);
		}
	}

	async deletProfileByUid(uuid: string): Promise<boolean> {
		let success: boolean = false;
		try {
			success = await this.userProfileDao.deleteUserProfileByUid(uuid);
			return success;
		} catch (err: any) {
			console.error(`Error deleting user profile by UID: ${err}`);
			return false;
		} finally {
			//console.log(`[Profile] Deleted user with UID: ${uuid} - Success: ${success}`);
		}
	}

	async getUserCredentialsByEmail(
		userEmail: string,
	): Promise<UserCredentials | null> {
		let credentials: UserCredentials | null = null;
		try {
			credentials =
				await this.userCredentialsDao.getCredentialsByEmail(userEmail);
			return credentials;
		} catch (err: any) {
			console.error(`Error retrieving credentials by email: ${err}`);
			return null;
		} finally {
			//console.log(`[Credentials] Retrieved user with email: ${userEmail} - Found: ${credentials !== null}`);
		}
	}

	async getUserCredentialsByToken(
		refreshToken: string,
	): Promise<UserCredentials | null> {
		let credentials: UserCredentials | null = null;
		try {
			credentials =
				await this.userCredentialsDao.getCredentialsByToken(refreshToken);
			// console.log(`Credentials found for ${refreshToken} : ${credentials}`)
			return credentials;
		} catch (err: any) {
			console.error(`Error retrieving credentials by token: ${err}`);
			return null;
		} finally {
			// console.log(`[Credentials] Retrieved user with token: ${refreshToken.substring(0, 5)}... - Found: ${credentials !== null}`);
		}
	}

	async getUserCredentialsByUid(
		userUid: string,
	): Promise<UserCredentials | null> {
		let credentials: UserCredentials | null = null;
		try {
			credentials = await this.userCredentialsDao.getCredentialsByUid(userUid);
			return credentials;
		} catch (err: any) {
			console.error(`Error retrieving credentials by UID: ${err}`);
			return null;
		} finally {
			//console.log(`[Credentials] Retrieved user with UID: ${userUid} - Found: ${credentials !== null}`);
		}
	}

	async getProfileByUid(uuid: string): Promise<UserProfile | null> {
		let profile: UserProfile | null = null;
		try {
			profile = await this.userProfileDao.getUserProfileByUid(uuid);
			return profile;
		} catch (err: any) {
			console.error(`Error retrieving user profile by UID: ${err}`);
			return null;
		} finally {
			//console.log(`[Profile] Retrieved user with UID: ${uuid} - Found: ${profile !== null}`);
		}
	}
}
