interface UserCredentials {
	user_uid: string;
	user_email: string;
	hashed_password: string;
	refresh_token: string | null;
	phone_number: string | null; // phone name with prefix etc
	last_login: string | null;
	user_role: "client" | "admin";
}

export default UserCredentials;
