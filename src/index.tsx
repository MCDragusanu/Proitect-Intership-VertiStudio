import { serve } from "bun";
import index from "./index.html";
import { getModule } from "./api/module";
import { computeBitSlow } from "./client/bitslow";
import { login } from "./api/routes/auth/login";
import { register } from "./api/routes/auth/register";
import { refreshAccessToken } from "./api/routes/auth/refresh";

// Initialize the database
const db = getModule().database;

const server = serve({
  port: 3000,
  development: process.env.NODE_ENV !== "production",
  routes : {
    "/*": index,
    "/api/transactions": () => {
			try {
				const transactions = db
					.query(`
          SELECT 
            t.id, 
            t.coin_id, 
            t.amount, 
            t.transaction_date,
            seller.user_uid as seller_id,
            seller.last_name as seller_name,
            buyer.user_uid as buyer_id,
            buyer.last_name as buyer_name,
            c.bit1,
            c.bit2,
            c.bit3,
            c.value
          FROM transactions t
          LEFT JOIN user_profiles seller ON t.seller_id = seller.user_uid
          JOIN user_profiles buyer ON t.buyer_id = buyer.user_uid
          JOIN coins c ON t.coin_id = c.coin_id
          ORDER BY t.transaction_date DESC
        `)
					.all();

				// Add computed BitSlow to each transaction
				const enhancedTransactions = transactions.map((transaction) => ({
					...transaction,
					computedBitSlow: computeBitSlow(
						transaction.bit1,
						transaction.bit2,
						transaction.bit3,
					),
				}));

				return Response.json(enhancedTransactions);
			} catch (error) {
				console.error("Error fetching transactions:", error);
				return new Response("Error fetching transactions", { status: 500 });
			}
		}
  },
  async fetch(req: Request) {
    const url = new URL(req.url);
   
    // ROUTE: /api/auth/registe  r
    if (url.pathname === "/api/auth/register" && req.method === "POST") {
      return await register(req);
    }
    // ROUTE: /api/auth/login
    if (url.pathname === "/api/auth/login" && req.method === "POST") {
      return await login(req);
    }
    // ROUTE: /api/auth/logout
    if (url.pathname === "/api/auth/refresh" && req.method === "POST") {
      return await refreshAccessToken(req);
    }
    // ROUTE: /api/auth/logout
    if (url.pathname === "/api/auth/logout" && req.method === "POST") {
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

    // ROUTE: /api/transactions
    if (url.pathname === "/api/transactions" && req.method === "GET") {
      console.log("retrieving transactions")
      try {
        const transactions = db
          .query(
            `SELECT 
              t.id, 
              t.coin_id, 
              t.amount, 
              t.transaction_date,
              seller.id as seller_id,
              seller.name as seller_name,
              buyer.id as buyer_id,
              buyer.name as buyer_name,
              c.bit1,
              c.bit2,
              c.bit3,
              c.value
            FROM transactions t
            LEFT JOIN clients seller ON t.seller_id = seller.id
            JOIN clients buyer ON t.buyer_id = buyer.id
            JOIN coins c ON t.coin_id = c.coin_id
            ORDER BY t.transaction_date DESC`
          )
          .all();

        const enhanced = transactions.map((t) => ({
          ...t,
          computedBitSlow: computeBitSlow(t.bit1, t.bit2, t.bit3),
        }));
        console.log(enhanced);
        return Response.json(enhanced);
      } catch (err) {
        console.error("Transaction error:", err);
        return new Response("Failed to fetch transactions", { status: 500 });
      }
    }

    // Default route: serve HTML
    return new Response(index, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});

console.log(`🚀 Server running at ${server.url}`);
