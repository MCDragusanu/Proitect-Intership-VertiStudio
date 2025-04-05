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

export abstract class BackendModule {
  public readonly authService: AuthService;
  public readonly jwtService: JWTService;
  public readonly userRepository: UserRepository;
  public readonly database: Database;

  constructor(
    authService: AuthService,
    jwtService: JWTService,
    userRepo: UserRepository,
    database: Database
  ) {
    this.authService = authService;
    this.jwtService = jwtService;
    this.userRepository = userRepo;
    this.database = database;
  }

  async initialize(): Promise<void> {
    seedDatabase(this.database, {
      clientCount: 30,
      bitSlowCount: 50,
      transactionCount: 50,
      clearExisting: true,
    });
  
  }
}

// Factory function to create the module
 function createBackendModule(): BackendModule {
  const db = new Database(":memory:");
  const credentialsDao = new SQLiteUserCredentialsDao();
  const profileDao = new SQLiteUserProfileDao();
  const repository = new SQLLiteUserRepository(credentialsDao, profileDao);

  const authService = new AuthServiceImpl(credentialsDao);
  const jwtService = new JWTServiceImpl();
 
  seedDatabase(db , {clientCount : 20 , transactionCount : 20 , bitSlowCount : 20 , clearExisting : false})
  const moduleInstance = new (class extends BackendModule {
    constructor() {
      super(authService, jwtService, repository, db);
    }
  })();

  return moduleInstance;
}

// Singleton holder
let instance: BackendModule | null = null;

// Exported getter
export function getModule(): BackendModule {
  if (!instance) {
    instance = createBackendModule();
  }
  return instance;
}
