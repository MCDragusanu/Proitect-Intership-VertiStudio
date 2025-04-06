import { Database } from "bun:sqlite";
import { faker } from "@faker-js/faker";
import { uuid } from "uuidv4";
import bcrypt from "bcrypt";
import { getModule } from "./module";

export async function seedDatabase(
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

  initializeSchema(db);

  const clients = await seedClients(db, clientCount);
  const coins = seedCoins(db, bitSlowCount, clients);
  seedTransactions(db, transactionCount, coins, clients);

  console.log("✅ Seeding complete!");
  return { clients, coins, transactionCount };
}

function initializeSchema(db: Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_credentials (
      user_uid TEXT PRIMARY KEY,
      user_email TEXT UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      refresh_token TEXT,
      phone_number TEXT,
      last_login TEXT,
      user_role TEXT CHECK(user_role IN ('client', 'admin')) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      user_uid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      account_creation_date TEXT NOT NULL,
      adress TEXT,
      country TEXT,
      city TEXT
    );

    CREATE TABLE IF NOT EXISTS coins (
      coin_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      bit1 INTEGER NOT NULL,
      bit2 INTEGER NOT NULL,
      bit3 INTEGER NOT NULL,
      value REAL NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES user_profiles(user_uid)
    );

      CREATE TABLE IF NOT EXISTS bitSlow (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  
      coin_id INTEGER NOT NULL,            
      bit1 INTEGER NOT NULL,
      bit2 INTEGER NOT NULL,
      bit3 INTEGER NOT NULL,
      computed_bit_slow TEXT NOT NULL,
      FOREIGN KEY (coin_id) REFERENCES coins(coin_id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coin_id INTEGER NOT NULL,
      seller_id TEXT,
      buyer_id TEXT NOT NULL,
      amount REAL NOT NULL,
      bit1 INTEGER NOT NULL,
      bit2 INTEGER NOT NULL,
      bit3 INTEGER NOT NULL,
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coin_id) REFERENCES coins(coin_id),
      FOREIGN KEY (seller_id) REFERENCES user_profiles(user_uid),
      FOREIGN KEY (buyer_id) REFERENCES user_profiles(user_uid)
    );`
  );
}

async function seedClients(db: Database, count: number): Promise<string[]> {
  console.log(`👤 Creating ${count} clients...`);

  const insertProfile = db.prepare(`
    INSERT INTO user_profiles (user_uid, name, account_creation_date, adress, country, city)
    VALUES (?, ?, ?, ?,  ?, ?)
  `);
  const insertCredentials = db.prepare(`
    INSERT INTO user_credentials (user_uid, user_email, hashed_password, refresh_token, phone_number, last_login, user_role)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const clientUids: string[] = [];

  for (let i = 0; i < count; i++) {
    const user_uid = uuid();
    const password = "Testtest123@";
    const email =  faker.internet.email()
    console.log(`${user_uid} ${email} ${password}`)
    const hashed_password = await bcrypt.hash(password, 10);
    const refresh_token = await getModule().jwtService.issueRefreshToken({
      userUid: user_uid,
      userRole: "client",
    });

    insertCredentials.run(
      user_uid,
      email,
      hashed_password,
      refresh_token,
      faker.phone.number(),
      new Date().toISOString(),
      "client"
    );

    insertProfile.run(
      user_uid,
      faker.person.firstName() + " " + faker.person.lastName(),
      new Date().toISOString(),
      faker.location.streetAddress(),
      faker.location.country(),
      faker.location.city()
    );
    console.log(user_uid)
    clientUids.push(user_uid);
  }

  return clientUids;
}

function seedCoins(
  db: Database,
  count: number,
  clientUids: string[]
): number[] {
  console.log(`💰 Creating ${count} BitSlows...`);

  const insert = db.prepare(`
    INSERT INTO coins (client_id, bit1, bit2, bit3, value)
    VALUES (?, ?, ?, ?, ?)
  `);

  const coinIds: number[] = [];
  const usedCombos = new Set<string>();
  const usedValues = new Set<number>();

  for (let i = 0; i < count; i++) {
    let bit1: number, bit2: number, bit3: number;
    let combo;
    do {
      [bit1, bit2, bit3] = generateDistinctRandomValues(3, 1, 10);
      combo = `${bit1}-${bit2}-${bit3}`;
    } while (usedCombos.has(combo));
    usedCombos.add(combo);

    let value: number;
    do {
      value = Math.floor(Math.random() * 90_000) + 10_000;
    } while (usedValues.has(value));
    usedValues.add(value);

    const clientId = clientUids[Math.floor(Math.random() * clientUids.length)]; 
    const info = insert.run(clientId, bit1, bit2, bit3, value);
    const coinId = Number(info.lastInsertRowid)
   
    console.log(`${clientId} -> ${coinId}`)
    coinIds.push(coinId);
  }

  return coinIds;
}

function generateDistinctRandomValues(
  count: number,
  min: number,
  max: number
): number[] {
  const values = new Set<number>();
  while (values.size < count) {
    values.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(values);
}

function seedTransactions(
  db: Database,
  count: number,
  coinIds: number[],
  clientUids: string[]
) {
  console.log(`💸 Creating ${count} transactions...`);

  const insert = db.prepare(`
    INSERT INTO transactions (coin_id, seller_id, buyer_id, amount, transaction_date , bit1 , bit2 , bit3)
    VALUES (?, ?, ?, ?, ?, ? ,? ,?)
  `);

  const coinOwners: Record<number, string | null> = {};
  let transactionDate = new Date();
  transactionDate.setMonth(transactionDate.getMonth() - 6);

  for (let i = 0; i < count; i++) {
    const coinId = coinIds[Math.floor(Math.random() * coinIds.length)];
    const sellerId = coinOwners[coinId] || null;
    

    let buyerId: string;
    do {
      buyerId = clientUids[Math.floor(Math.random() * clientUids.length)];
    } while (buyerId === sellerId);

    const coin = db
      .query("SELECT bit1, bit2, bit3, value FROM coins WHERE coin_id = ?")
      .get(coinId);
    const amount = coin?.value ?? 0;

    transactionDate = new Date(
      transactionDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000
    ); // add 0-2 days
   
    insert.run(
      coinId,
      sellerId,
      buyerId,
      amount,
      transactionDate.toISOString(),
      coin.bit1,
      coin.bit2,
      coin.bit3
    );

    coinOwners[coinId] = buyerId;
  }
}
