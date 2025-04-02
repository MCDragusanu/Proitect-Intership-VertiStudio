import { AuthService } from "./auth/AuthService";
import { JWTService } from "./auth/JWTService";
import { SQLLiteUserRepository } from "../api/database_impl/UserRepositoryImpl";
import { AuthServiceImpl } from "./auth_impl/AuthServiceImpl";
import JWTServiceImpl from "./auth_impl/JWTServiceImpl";
import UserRepository from "./database/UserRepository";
import SQLiteUserCredentialsDao from "./database_impl/UserCredentialsDaoImpl";
import SQLiteUserProfileDao from "./database_impl/UserProfileDaoImpl";

export abstract class BackendModule {
  public readonly authService: AuthService;
  public readonly jwtService: JWTService;
  public readonly userRepository: UserRepository;

  constructor(authService: AuthService, jwtService: JWTService, userRepo: UserRepository) {
    this.authService = authService;
    this.jwtService = jwtService;
    this.userRepository = userRepo;
  }
}

class MainModule extends BackendModule {
  private static instance: MainModule | null = null;

  private constructor() {
    const credentialsDao = new SQLiteUserCredentialsDao()
    const profileDao = new SQLiteUserProfileDao()
    const repository = new SQLLiteUserRepository(
     credentialsDao,
      profileDao
    );
    
    super(new AuthServiceImpl(credentialsDao), new JWTServiceImpl(), repository);
  }

  public static getInstance(): MainModule {
    if (!this.instance) {
      this.instance = new MainModule();
      this.instance.userRepository.initialise()
    }
    return this.instance;
  }
}

// Export a single instance for global use
export const module = MainModule.getInstance();
export function getModule(): BackendModule {
  return module;
}
