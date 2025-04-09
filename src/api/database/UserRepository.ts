import  type UserProfile from "@/src/shared/user_profile";
import type UserCredentials from "@/src/shared/user_credentials";

export default interface UserRepository {
	insertProfile(profile: UserProfile): Promise<boolean>;
	insertCredentials(credentials: UserCredentials): Promise<boolean>;

	updateCredentials(credentials: UserCredentials): Promise<boolean>;
	updateProfile(profile: UserProfile): Promise<boolean>;

	updateRefreshToken(userUid: string, token: string | null): Promise<boolean>;

	getUserCredentialsByToken(
		refreshToken: string,
	): Promise<UserCredentials | null>;
	getUserCredentialsByUid(userUid: string): Promise<UserCredentials | null>;
	getUserCredentialsByEmail(userEmail: string): Promise<UserCredentials | null>;
	getProfileByUid(uuid: string): Promise<UserProfile | null>;

	deletProfileByUid(uuid: string): Promise<boolean>;
	deleteCredentialsByUid(userUid: string): Promise<boolean>;
	deleteCredentialsByEmail(userEmail: string): Promise<boolean>;
}
