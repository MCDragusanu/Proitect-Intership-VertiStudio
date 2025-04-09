import type UserCredentials from "@/src/shared/user_credentials";
import UserCredentialsDao from "../database/UserCredentialsDao";
import { getModule } from "../module";

class SQLiteUserCredentialsDao implements UserCredentialsDao {
	constructor() {}

	async insertUserCredentials(credentials: UserCredentials): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"INSERT INTO user_credentials (user_uid, user_email, hashed_password, refresh_token, phone_number, last_login, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)",
		);
		const info = stmt.run(
			credentials.user_uid,
			credentials.user_email,
			credentials.hashed_password,
			credentials.refresh_token,
			credentials.phone_number,
			credentials.last_login,
			credentials.user_role,
		);
		return info.changes > 0;
	}
	async updateRefreshToken(
		userUid: string,
		token: string | null,
	): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"UPDATE user_credentials SET  refresh_token = ?,  WHERE user_uid = ?",
		);
		const info = stmt.run(token, userUid);
		return info.changes > 0;
	}
	async updateUserCredentials(credentials: UserCredentials): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"UPDATE user_credentials SET user_email = ?, hashed_password = ?, refresh_token = ?, phone_number = ?, last_login = ?, user_role = ? WHERE user_uid = ?",
		);
		const info = stmt.run(
			credentials.user_email,
			credentials.hashed_password,
			credentials.refresh_token,
			credentials.phone_number,
			credentials.last_login,
			credentials.user_role,
			credentials.user_uid,
		);
		return info.changes > 0;
	}

	async getCredentialsByEmail(
		userEmail: string,
	): Promise<UserCredentials | null> {
		const stmt = getModule().database.prepare(
			"SELECT * FROM user_credentials WHERE user_email = ?",
		);
		const result = stmt.get(userEmail);
		return result ? this.mapToUserCredentials(result) : null;
	}

	async getCredentialsByToken(
		refreshToken: string,
	): Promise<UserCredentials | null> {
		const stmt = getModule().database.prepare(
			"SELECT * FROM user_credentials WHERE refresh_token = ?",
		);
		const result = stmt.get(refreshToken);
		return result ? this.mapToUserCredentials(result) : null;
	}

	async getCredentialsByUid(userUid: string): Promise<UserCredentials | null> {
		const stmt = getModule().database.prepare(
			"SELECT * FROM user_credentials WHERE user_uid = ?",
		);
		const result = stmt.get(userUid);
		return result ? this.mapToUserCredentials(result) : null;
	}

	async deleteUserCredentialsByEmail(userEmail: string): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"DELETE FROM user_credentials WHERE user_email = ?",
		);
		const info = stmt.run(userEmail);
		return info.changes > 0;
	}

	async deleteUserCredentialsByUid(userUid: string): Promise<boolean> {
		const stmt = getModule().database.prepare(
			"DELETE FROM user_credentials WHERE user_uid = ?",
		);
		const info = stmt.run(userUid);
		return info.changes > 0;
	}

	private mapToUserCredentials(row: any): UserCredentials {
		return {
			user_uid: row.user_uid,
			user_email: row.user_email,
			hashed_password: row.hashed_password,
			refresh_token: row.refresh_token,
			phone_number: row.phone_number,
			last_login: row.last_login,
			user_role: row.user_role,
		};
	}
}

export { SQLiteUserCredentialsDao };
