import { serve } from "bun";
import index from "./index.html";
import { getModule } from "./api/module";
import { computeBitSlow } from "./client/bitslow";
import { login } from "./api/routes/auth/login";
import { register } from "./api/routes/auth/register";

// Initialize the database
const db = getModule().database;

const server = serve({
  port: 3000,
  development: process.env.NODE_ENV !== "production",

  async fetch(req: Request) {
    const url = new URL(req.url);

    // ROUTE: /api/auth/register
    if (url.pathname === "/api/auth/register" && req.method === "POST") {
      return await register(req);
    }
    // ROUTE: /api/auth/login
    if (url.pathname === "/api/auth/login" && req.method === "POST") {
      return await login(req);
    }

    // ROUTE: /api/auth/logout
    if (url.pathname === "/api/auth/logout" && req.method === "POST") {
      try {
        const { userUid } = await req.json();
        db.prepare("UPDATE user_credentials SET refresh_token = NULL WHERE user_uid = ?").run(userUid);
        return new Response("Logged out successfully", { status: 200 });
      } catch (err) {
        console.error("Logout error:", err);
        return new Response("Logout failed", { status: 500 });
      }
    }

    // ROUTE: /api/transactions
    if (url.pathname === "/api/transactions" && req.method === "GET") {
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
		console.log(enhanced)
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
