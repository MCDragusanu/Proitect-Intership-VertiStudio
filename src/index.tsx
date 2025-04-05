import { serve } from "bun";
import index from "./index.html";
import { getModule } from "./api/module";
import { computeBitSlow } from "./client/bitslow";
import { login } from "./api/routes/auth/login";
import { register } from "./api/routes/auth/register";
import { refreshAccessToken } from "./api/routes/auth/refresh";
import { getTransactions, getTransactionsV2 } from "./api/routes/transactions/getTransactions";

// Initialize the database
const db = getModule().database;

const server = serve({
  port: 3000,
  development: process.env.NODE_ENV !== "production",

  routes: {
    // Custom route for /api/transactions
    "/api/transactions/v1": async (req) => {
      console.log(req);
      if (req.method === "POST") {
        console.log("POST request to /api/transactions intercepted!");

        // Call your `getTransaction` function when a POST request is made to /api/transactions
        return await getTransactions(req);
      }

      // Handle method not allowed
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
"/api/transactions/v2": async (req) => {
      console.log(req);
      if (req.method === "POST") {
        console.log("POST request to /api/transactions intercepted!");

        // Call your `getTransaction` function when a POST request is made to /api/transactions
        return await getTransactionsV2(req);
      }

      // Handle method not allowed
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    // Handle other API routes similarly
    "/api/auth/register": async (req) => {
      if (req.method === "POST") {
        return await register(req);
      }

      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    "/api/auth/login": async (req) => {
      if (req.method === "POST") {
        return await login(req);
      }

      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    "/api/auth/refresh": async (req) => {
      if (req.method === "POST") {
        return await refreshAccessToken(req);
      }

      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    "/api/auth/logout": async (req) => {
      if (req.method === "POST") {
        try {
          const { userUid } = await req.json();
          db.prepare(
            "UPDATE user_credentials SET refresh_token = NULL WHERE user_uid = ?"
          ).run(userUid);
          return new Response("Logged out successfully", { status: 200 });
        } catch (err) {
          console.error("Logout error:", err);
          return new Response("Logout failed", { status: 500 });
        }
      }

      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    // Add other API routes here...

  },

  // Default route for serving HTML should be the last
  async fetch(req: Request) {
    const url = new URL(req.url);

    // If no matching route, serve the HTML file
    return new Response(index, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`🚀 Server running at ${server.url}`);
