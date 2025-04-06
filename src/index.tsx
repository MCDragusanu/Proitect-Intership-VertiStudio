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
    "/api/users/:userUid": async (req) => {
      const routeUserUid = req.url.split("/").pop();

      if (req.method === "GET" && routeUserUid !== undefined) {
        console.log(`Retrieving userInformation for ${routeUserUid}`);

        const tokenValidationError = await validateTokens(req, routeUserUid);

        if (tokenValidationError) return tokenValidationError;

        // You can pass userUid to the handler
        return await getUserInformation(req, routeUserUid);
      }

      return methodNotAllowed();
    },

    "/api/transactions/v2/:userUid": async (req) => {
      const routeUserUid = req.url.split("/").pop();

      if (req.method === "POST" && routeUserUid !== undefined) {
        console.log(`Retrieving transactions for user ${routeUserUid}`);
        const tokenValidationError = await validateTokens(req, routeUserUid);
        if (tokenValidationError) return tokenValidationError;

        // You can pass userUid to the handler
        return await getTransactionsByUser(req);
      }

      return methodNotAllowed();
    },

    "/api/coins/history/:coinId": async (req) => {
      const routeCoinId = Number(req.url.split("/").pop());
      if (req.method === "GET" && !Number.isNaN(routeCoinId)) {
        console.log()
        return await GetCoinHistory(routeCoinId);
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
        // Implement logout logic here (clear cookies, tokens, etc.)
        return new Response("Logged out", { status: 200 });
      }
      return methodNotAllowed();
    },

    // Add other API routes here...
  },
});

console.log(`🚀 Server running at ${server.url}`);
