import { serve } from "bun";
import index from "./index.html";
import { login } from "./api/routes/auth/login";
import { register } from "./api/routes/auth/register";
import { refreshAccessToken } from "./api/routes/auth/refresh";
import {
	getTransactionsByUser,
	queryTransactions,
} from "./api/routes/transactions/GetTransactions";
import { renderToReadableStream } from "react-dom/server";
import TransactionsPage from "./client/pages/transactions/TransactionHistoryPage";
import {
	extractAccessToken,
	extractRefreshToken,
	isTokenPayLoad,
} from "./api/routes/auth/utils";
import { getModule } from "./api/module";
import { JWTExpired, JWTInvalid } from "./api/auth/JWTService";
import { TokenPayLoad } from "./api/auth/JWTService";
import { validateTokens } from "./api/routes/middleware/validate_tokens";
import { getUserInformation } from "./api/routes/users/GetUserProfile";
import { GetCoinHistory } from "./api/routes/coins/GetCoinHistory";
import { logout } from "./api/routes/auth/logout";
import { GetAvailableCoins } from "./api/routes/coins/GetAllCoins";
import { GetCoinById } from "./api/routes/coins/GetCoinById";
import { CreateNewCoins } from "./api/routes/coins/GenerateNewCoins";
import { seedDatabase } from "./api/seed";
import { GetCoinSupply } from "./api/routes/coins/GetRemainingCoins";
import { CreateTransaction } from "./api/routes/transactions/CreateTransaction";
seedDatabase(getModule().database, {
	transactionCount: 500,
	clientCount: 250,
	bitSlowCount: 375,
	clearExisting: true,
});

// Helper function to handle method not allowed response
const methodNotAllowed = () =>
	new Response("Method Not Allowed", {
		status: 405,
		headers: { "Content-Type": "application/json" },
	});

const server = serve({
	port: 3000,
	development: process.env.NODE_ENV !== "production",

	routes: {
		"/": index,

		"/market": async () => {
			console.log("Begin Rendering market page");
			const stream = await renderToReadableStream(<TransactionsPage />);
			return new Response(stream, { headers: { "Content-Type": "text/html" } });
		},

		// v2 transactions API (for all transactions)
		"/api/transactions/v2": async (req) => {
			if (req.method === "POST") {
				console.log("POST request to /api/transactions intercepted!");
				return await queryTransactions(req);
			}
			return methodNotAllowed();
		},
		"/api/users/:userUid": async (req: Request) => {
			const url = new URL(req.url);
			const pathnameParts = url.pathname.split("/");
			const routeUserUid = pathnameParts[pathnameParts.length - 1]; // clean UID, no query

			if (req.method === "GET" && routeUserUid) {
				const offset = Number(url.searchParams.get("offset") ?? "0");
				const limit = Number(url.searchParams.get("limit") ?? "10");

				console.log(
					`Retrieving userInformation for ${routeUserUid} ; coins with offset=${offset} and limit=${limit}`,
				);

				const tokenValidationError = await validateTokens(req, routeUserUid);
				if (tokenValidationError) return tokenValidationError;

				return await getUserInformation(req, routeUserUid, offset, limit);
			}

			return methodNotAllowed();
		},

		"/api/transactions/v2/:userUid": async (req) => {
			const routeUserUid = req.url.split("/").pop();

			if (req.method === "POST" && routeUserUid !== undefined) {
				console.log(`Retrieving transactions for user ${routeUserUid}`);
				const tokenValidationError = await validateTokens(req, routeUserUid);
				if (tokenValidationError) return tokenValidationError;

				return await getTransactionsByUser(req);
			}

			return methodNotAllowed();
		},

		"/api/coins/history/:coinId": async (req) => {
			const routeCoinId = Number(req.url.split("/").pop());
			if (req.method === "GET" && !Number.isNaN(routeCoinId)) {
				return await GetCoinHistory(routeCoinId);
			}
			return methodNotAllowed();
		},
		"/api/coins/:coinId": async (req) => {
			const routeCoinId = Number(req.url.split("/").pop());
			if (req.method === "GET" && !Number.isNaN(routeCoinId)) {
				console.log("Fetching coin by uid : " + routeCoinId);
				return await GetCoinById(routeCoinId);
			}
			return methodNotAllowed();
		},

		"/api/coins": async (req: Request) => {
			if (req.method === "GET") {
				const url = new URL(req.url);
				const offset = Number(url.searchParams.get("offset") ?? "0");
				const limit = Number(url.searchParams.get("limit") ?? "10");

				console.log(`Fetching coins with offset=${offset} and limit=${limit}`);

				return await GetAvailableCoins(offset, limit);
			}

			return methodNotAllowed();
		},
		"/api/coins/supply": async (req) => {
			if (req.method === "GET") {
				console.log("Fetching coin supply");
				return await GetCoinSupply();
			}
			return methodNotAllowed();
		},
    "/api/coins/buy/:{userUid}" : async (req) => {
			const routeUserUid = req.url.split("/").pop();
			console.log("UserUid in url : ");
			console.log(routeUserUid);
			if (req.method === "POST" && routeUserUid !== undefined) {
				console.log("Preparing to validate purchase ");
				const tokenValidationError = await validateTokens(req, routeUserUid);
				if (tokenValidationError) {
					console.log("Validation failed ");
					return tokenValidationError;
				}
				console.log("Geneating new coins");
				return await CreateTransaction(req, routeUserUid);
			}

			return methodNotAllowed();
		},
		"/api/coins/generate/:userUid": async (req) => {
			const routeUserUid = req.url.split("/").pop();
			console.log("UserUid in url : ");
			console.log(routeUserUid);
			if (req.method === "POST" && routeUserUid !== undefined) {
				console.log("Preparing to validate genearation ");
				const tokenValidationError = await validateTokens(req, routeUserUid);
				if (tokenValidationError) {
					console.log("Validation failed ");
					return tokenValidationError;
				}
				console.log("Processing");
				return await CreateNewCoins(req, routeUserUid);
			}

			return methodNotAllowed();
		},
		// Authentication routes
		"/api/auth/register": async (req) => {
			if (req.method === "POST") {
				return await register(req);
			}
			return methodNotAllowed();
		},

		"/api/auth/login": async (req) => {
			if (req.method === "POST") {
				return await login(req);
			}
			return methodNotAllowed();
		},

		"/api/auth/refresh": async (req) => {
			if (req.method === "POST") {
				return await refreshAccessToken(req);
			}
			return methodNotAllowed();
		},

		"/api/auth/logout": async (req) => {
			if (req.method === "POST") {
				return await logout(req);
			}
			return methodNotAllowed();
		},
	},
});

console.log(`🚀 Server running at ${server.url}`);
