import { AuthService } from "./auth/AuthService";
import { JWTService } from "./auth/JWTService";
import { SQLLiteUserRepository } from "../api/database_impl/UserRepositoryImpl";
import { AuthServiceImpl } from "./auth_impl/AuthServiceImpl";
import JWTServiceImpl from "./auth_impl/JWTServiceImpl";
import UserRepository from "./database/UserRepository";
import { SQLiteUserCredentialsDao } from "./database_impl/UserCredentialsDaoImpl";
import { SQLiteUserProfileDao } from "./database_impl/UserProfileDaoImpl";
import { Database } from "bun:sqlite";
import { seedDatabase } from "./seed";
import BitSlowRepository from "./database/BitSlowRepository";
import SQLiteCoinDao from "./database_impl/CoinDaoImpl";
import SQLiteTransactionDao from "./database_impl/TransactionDaoImpl";
import { SQLiteBitSlowRepository } from "./database_impl/BitSlowRepositoryImpl";
import SQLBitSlowDao from "./database_impl/BitSlowDaoImpl";
export abstract class BackendModule {
  public readonly authService: AuthService;
  public readonly jwtService: JWTService;
  public readonly userRepository: UserRepository;
  public readonly database: Database;
  public readonly bitSlowRepo: BitSlowRepository;
  constructor(
    authService: AuthService,
    jwtService: JWTService,
    userRepo: UserRepository,
    bitSlowRepo : BitSlowRepository,
    database: Database
  ) {
    this.authService = authService;
    this.jwtService = jwtService;
    this.userRepository = userRepo;
    this.bitSlowRepo = bitSlowRepo
    this.database = database;
  }

  initialize(){
    seedDatabase(this.database, {
      clientCount: 100,
      bitSlowCount: 125,
      transactionCount: 500,
      clearExisting: true,
    });
  
  }
}

function createInMemoryModule(): BackendModule {
  const db = new Database(":memory:");

  // DAOs for users
  const credentialsDao = new SQLiteUserCredentialsDao();
  const profileDao = new SQLiteUserProfileDao();

  // DAOs for bitslow-related data
  const bitSlowDao = new SQLBitSlowDao();
  const coinDao = new SQLiteCoinDao();
  const transactionDao = new SQLiteTransactionDao();

  // Repositories
  const repository = new SQLLiteUserRepository(credentialsDao, profileDao);
  const bitSlowRepository = new SQLiteBitSlowRepository(bitSlowDao, coinDao, transactionDao);

  // Services
  const authService = new AuthServiceImpl(credentialsDao);
  const jwtService = new JWTServiceImpl();

 
  // Return BackendModule instance
  const moduleInstance = new (class extends BackendModule {
    constructor() {
      super(authService, jwtService, repository, bitSlowRepository ,db);
  
    }
  })();

  return moduleInstance;
}
function createPersistentModule(): BackendModule {
  const db = new Database("mydb.sqlite");

  // DAOs for users
  const credentialsDao = new SQLiteUserCredentialsDao();
  const profileDao = new SQLiteUserProfileDao();

  // DAOs for bitslow-related data
  const bitSlowDao = new SQLBitSlowDao();
  const coinDao = new SQLiteCoinDao();
  const transactionDao = new SQLiteTransactionDao();

  // Repositories
  const repository = new SQLLiteUserRepository(credentialsDao, profileDao);
  const bitSlowRepository = new SQLiteBitSlowRepository(bitSlowDao, coinDao, transactionDao);

  // Services
  const authService = new AuthServiceImpl(credentialsDao);
  const jwtService = new JWTServiceImpl();

 
  // Return BackendModule instance
  const moduleInstance = new (class extends BackendModule {
    constructor() {
      super(authService, jwtService, repository, bitSlowRepository ,db);
      this.initialize()
    }
  })();

  return moduleInstance;
}

// Singleton holder
let instance: BackendModule | null = null;

// Exported getter
export function getModule(): BackendModule {
  if (!instance) {
    instance = createPersistentModule();
    
  }
  return instance;
}
