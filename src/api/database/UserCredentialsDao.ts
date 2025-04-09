import type UserCredentials from "@/src/shared/user_credentials";

interface UserCredentialsDao {
	insertUserCredentials(credentials: UserCredentials): Promise<boolean>;
	updateUserCredentials(credentials: UserCredentials): Promise<boolean>;

	updateRefreshToken(userUid: string, token: string | null): Promise<boolean>;

	getCredentialsByToken(refreshToken: string): Promise<UserCredentials | null>;
	getCredentialsByUid(userUid: string): Promise<UserCredentials | null>;
	getCredentialsByEmail(userEmail: string): Promise<UserCredentials | null>;

	deleteUserCredentialsByUid(userUid: string): Promise<boolean>;
	deleteUserCredentialsByEmail(userEmail: string): Promise<boolean>;
}

export default UserCredentialsDao;
