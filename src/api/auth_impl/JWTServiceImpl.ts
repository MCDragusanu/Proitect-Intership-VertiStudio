import {
	JWTService,
	JWTError,
	JWTExpired,
	JWTInvalid,
	TokenPayLoad,
} from "../auth/JWTService";
import jwt, { JwtPayload } from "jsonwebtoken";

//A JWTService implementation as a Singleton
class JWTServiceImpl implements JWTService {
	//this will be changed later
	private static jwtAccessSecret = "ACCESS_TEST";
	private static jwtRefreshSecret = "REFRESH_SECRET";

	//a private static instance to use

	constructor() {}

	async issueAccessToken(payload: TokenPayLoad): Promise<string> {
		return jwt.sign({ data: payload }, JWTServiceImpl.jwtAccessSecret, {
			algorithm: "HS256",
			expiresIn: this.getAccessTokenDurationInSeconds(),
		});
	}

	async issueRefreshToken(payload: TokenPayLoad): Promise<string> {
		return jwt.sign({ data: payload }, JWTServiceImpl.jwtRefreshSecret, {
			algorithm: "HS256",
			expiresIn: this.getRefreshTokenDurationInSeconds(),
		});
	}

	getAccessTokenDurationInSeconds(): number {
		return 60 * 15; // 15 minutes
	}

	getRefreshTokenDurationInSeconds(): number {
		return 15 * 24 * 60 * 60; // 15 days
	}

	async extractPayloadFromAccessToken(
		token: string,
	): Promise<TokenPayLoad | JWTError> {
		try {
			const result = jwt.verify(token, JWTServiceImpl.jwtAccessSecret) as JwtPayload;
			if (!result.data || typeof result.data !== "object") {
				return new JWTInvalid("Invalid token payload!");
			}

			return { userUid: result.data.userUid, userRole: result.data.userRole };
		} catch (error: any) {
			if (error.name === "TokenExpiredError") {
				return new JWTExpired("The access token provided is expired!");
			}
			if (error.name === "JsonWebTokenError") {
				return new JWTInvalid("The access token provided is invalid!");
			}
			return new JWTError(
				"Unknown error occurred while processing the access token!",
			);
		}
	}

	async extractPayloadFromRefreshToken(
		token: string,
	): Promise<TokenPayLoad | JWTError> {
		try {
			const result = jwt.verify(token, JWTServiceImpl.jwtRefreshSecret) as JwtPayload;
			if (!result.data || typeof result.data !== "object") {
				return new JWTInvalid("Invalid token payload!");
			}

			return { userUid: result.data.userUid, userRole: result.data.userRole };
		} catch (error: any) {
			if (error.name === "TokenExpiredError") {
				return new JWTExpired("The refresh token provided is expired!");
			}
			if (error.name === "JsonWebTokenError") {
				return new JWTInvalid("The refresh token provided is invalid!");
			}
			return new JWTError(
				"Unknown error occurred while processing the refresh token!",
			);
		}
	}
}

export default JWTServiceImpl;
