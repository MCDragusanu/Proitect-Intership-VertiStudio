import { Database } from "bun:sqlite";
import { faker } from "@faker-js/faker";
import { uuid } from "uuidv4";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { TokenPayLoad } from "./auth/JWTService";
import { getModule } from "./module";

/**
 * Initialize database schema and seed with random data
 * @param db SQLite database instance
 * @param options Configuration options for seeding
 */
export function seedDatabase(
  db: Database,
  options: {
    clientCount?: number;
    bitSlowCount?: number;
    transactionCount?: number;
    clearExisting?: boolean;
  } = {}
) {
  const {
    clientCount = 20,
    bitSlowCount = 50,
    transactionCount = 10,
    clearExisting = false,
  } = options;

  console.log("🌱 Initializing database schema and seeding data...");

  if (clearExisting) {
    console.log("🗑️ Clearing existing data...");
    db.exec(`
      DROP TABLE IF EXISTS transactions;
      DROP TABLE IF EXISTS coins;
      DROP TABLE IF EXISTS user_credentials;
	  DROP TABLE IF EXISTS user_profiles;
	  
    `);
  }

  // Initialize database schema
  initializeSchema(db);

  // Generate random data
  const clients = seedClients(db, clientCount);
  const coins = seedCoins(db, bitSlowCount, clients.length);
  seedTransactions(db, transactionCount, coins.length, clients.length);

  console.log("✅ Database seeding complete!");
  console.log(
    `📊 Generated ${clientCount} clients, ${bitSlowCount} BitSlows, and ${transactionCount} transactions.`
  );

  return {
    clients,
    coins,
    transactionCount,
  };
}

/**
 * Initialize database schema
 */
function initializeSchema(db: Database) {
  console.log("📝 Creating tables if they don't exist...");

  db.exec(`
    -- Create Credentials Table
    CREATE TABLE IF NOT EXISTS user_credentials (
        user_uid TEXT PRIMARY KEY,
        user_email TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        refresh_token TEXT,
        phone_number TEXT,
        last_login TEXT,
        user_role TEXT CHECK(user_role IN ('client', 'admin')) NOT NULL
    );
    -- Create clients table
    CREATE TABLE IF NOT EXISTS user_profiles (
        user_uid TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        account_creation_date TEXT NOT NULL,
		adress TEXT,
        country TEXT,
        city TEXT,
        FOREIGN KEY (user_uid) REFERENCES user_credentials(user_uid)
    );

    -- Create coins table
    CREATE TABLE IF NOT EXISTS coins (
        coin_id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id TEXT,
        bit1 INTEGER NOT NULL,
        bit2 INTEGER NOT NULL,
        bit3 INTEGER NOT NULL,
        value REAL NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (client_id) REFERENCES clients (id)
    );

    -- Create transactions table
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        coin_id INTEGER NOT NULL,
        seller_id TEXT,
        buyer_id TEXT NOT NULL,
        amount REAL NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coin_id) REFERENCES coins (coin_id),
        FOREIGN KEY (seller_id) REFERENCES clients (id),
        FOREIGN KEY (buyer_id) REFERENCES clients (id)
    );
  `);
}

/**
 * Generate random clients with credentials and profiles
 */
function seedClients(db: Database, count: number): number[] {
  console.log(`👤 Generating ${count} random clients...`);

  const clientIds: number[] = [];
  const insertClient = db.prepare(`
    INSERT INTO user_profiles (user_uid, first_name, last_name, account_creation_date, adress, country, city)
    VALUES (?, ?, ?, ?, ?, ? , ?)
  `);

  const insertCredentials = db.prepare(`
    INSERT INTO user_credentials (user_uid, user_email, hashed_password, refresh_token, phone_number, last_login, user_role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(async () => {
    for (let i = 0; i < count; i++) {
      const user_uid = uuid();
      const first_name = faker.person.firstName();
      const last_name = faker.person.lastName();
      const email = faker.internet.email();
      const phone = faker.phone.number();
      const country = faker.location.country();
      const city = faker.location.city();
      const adress = faker.location.streetAddress();
      const account_creation_date = new Date().toISOString();
      const password = "Testtest123@"; // Set static password for all users
      const hashed_password = await bcrypt.hash(password, 10); // Hash the password
      const user_role = "client";
      const tokenPayload: TokenPayLoad = {
        userRole: user_role,
        userUid: user_uid,
      };
      const refresh_token = await getModule().jwtService.issueRefreshToken(
        tokenPayload
      ); // Generate a refresh token

      // Insert into user credentials table
      insertCredentials.run(
        user_uid,
        email,
        hashed_password,
        refresh_token,
        phone,
        new Date().toISOString(),
        user_role
      );

      // Insert into user profiles table
      insertClient.run(
        user_uid,
        first_name,
        last_name,
        account_creation_date,
        adress,
        country,
        city
      );

      clientIds.push(Number(user_uid)); // Add user_uid to clientIds array (just for tracking)
    }
  })();

  return clientIds;
}

/**
 * Generate random BitSlows
 */
function seedCoins(db: Database, count: number, clientCount: number): number[] {
  console.log(`💰 Generating ${count} random BitSlows...`);

  const coinIds: number[] = [];
  const insertCoin = db.prepare(`
    INSERT INTO coins (client_id, bit1, bit2, bit3, value)
    VALUES (?, ?, ?, ?, ?)
  `);

  const usedValues = new Set<number>();
  const usedBitCombinations = new Set<string>();

  db.transaction(() => {
    for (let i = 0; i < count; i++) {
      const clientId =
        Math.random() > 0.2
          ? Math.floor(Math.random() * clientCount) + 1
          : null;

      let bit1: number, bit2: number, bit3: number;
      let bitCombinationKey: string;

      do {
        const bitValues = generateDistinctRandomValues(3, 1, 10);
        bit1 = bitValues[0];
        bit2 = bitValues[1];
        bit3 = bitValues[2];
        bitCombinationKey = `${bit1}-${bit2}-${bit3}`;
      } while (usedBitCombinations.has(bitCombinationKey));

      usedBitCombinations.add(bitCombinationKey);

      let value: number;
      do {
        value = Math.floor(Math.random() * 90_000) + 10_000;
      } while (usedValues.has(value));

      usedValues.add(value);

      const info = insertCoin.run(clientId, bit1, bit2, bit3, value);
      coinIds.push(Number(info.lastInsertId));
    }
  })();

  return coinIds;
}

/**
 * Generate an array of distinct random numbers
 * @param count Number of distinct values to generate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Array of distinct random values
 */
function generateDistinctRandomValues(
  count: number,
  min: number,
  max: number
): number[] {
  if (max - min + 1 < count) {
    throw new Error(
      `Cannot generate ${count} distinct values in range [${min}, ${max}]`
    );
  }

  const values: Set<number> = new Set();
  while (values.size < count) {
    values.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return Array.from(values);
}

/**
 * Generate random transactions
 */
function seedTransactions(
  db: Database,
  count: number,
  coinCount: number,
  clientCount: number
) {
  console.log(`💸 Generating ${count} random transactions...`);

  const insertTransaction = db.prepare(`
    INSERT INTO transactions (coin_id, seller_id, buyer_id, amount, transaction_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  const coinOwners: Record<string, string | null> = {};
  let latestTransactionDate = new Date();
  latestTransactionDate.setMonth(latestTransactionDate.getMonth() - 6);

  db.transaction(() => {
    for (let i = 0; i < count; i++) {
      console.log(`Generating ${i}th transaction`);
      const coinId = Math.floor(Math.random() * coinCount) + 1;
      const sellerId = coinOwners[coinId] || null;

      let buyerId: string;
      do {
        buyerId = uuid();
      } while (buyerId === sellerId);

      const coinValue =
        db.query("SELECT value FROM coins WHERE coin_id = ?").get(coinId)
          ?.value || 0;

      const amount = coinValue;
      const minutesToAdd = Math.floor(Math.random() * 2880) + 1;
      latestTransactionDate = new Date(
        latestTransactionDate.getTime() + minutesToAdd * 60000
      );

      insertTransaction.run(
        coinId,
        sellerId,
        buyerId,
        amount.toFixed(2),
        latestTransactionDate.toISOString()
      );

      coinOwners[coinId] = buyerId;
    }
  })();
}
