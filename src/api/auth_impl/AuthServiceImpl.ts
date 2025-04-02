import {
  AuthResult,
  AuthService,
  AuthError,
  InvalidCredentials,
  UserCollision,
  PasswordFlags,
  UserNotFound,
  WeakCredentials,
  PasswordRequirements,
} from "../auth/AuthService";
import UserCredentialsDao from "../database/UserCredentialsDao";
import bcrypt from "bcrypt";
import { randomUUIDv7 } from "bun";

export class AuthServiceImpl implements AuthService {
  private credentialsDao: UserCredentialsDao;
  
  constructor(credentialsDao: UserCredentialsDao) {
    this.credentialsDao = credentialsDao;
  }

  async loginUser(
    userEmail: string,
    plainPassword: string
  ): Promise<AuthResult | AuthError> {
    try {
      //fetch the credentials by email  
      const credentials = await this.credentialsDao.getCredentialsByEmail(
        userEmail
      );
      
      //if no credentials found return an error
      if (credentials === null) {
        throw new InvalidCredentials("Please enter valid credentials!");
      }

      //compare the 2 passwords
      const passwordMatch = await bcrypt.compare(
        plainPassword,
        credentials.hashedPassword
      );

      //check the passwords
      if (!passwordMatch) {
        throw new InvalidCredentials("Please Enter valid credentials!");
      }

      //return the result
      return {
        userUid: credentials.userUid,
        lastLogin: new Date().toDateString(),
      };

    } catch (error: any) {
      console.log(`Error @LoginUser : ${error}`);
      if(error instanceof AuthError)
         return error
      else 
        return new AuthError(
        "Unknown Error has occurred while authentificating user!"
      );
    }
  }

  async registerUser(
    userEmail: string,
    plainPassword: string
  ): Promise<AuthResult | AuthError> {
    try {

      //fetch the credentials by email from database  
      const credentials = await this.credentialsDao.getCredentialsByEmail(
        userEmail
      );

      //check to see if the email is in use
      if (credentials !== null) {
        throw new UserCollision("This email is already in use!");
      }
      
      //check the password strength
      const passwordFlags = this.checkPasswordStrength(plainPassword);
      
      //if any condition is failed throw WeakCredentials
      if (passwordFlags.length !== 0) {
        throw new WeakCredentials("Password is too weak!", passwordFlags);
      }

      //issue an uid and return the result
      return{
        userUid: randomUUIDv7(),
        lastLogin: new Date().toDateString(),
      };
    } catch (error: any) {
      console.log(`Failed @registerUser : ${error}`);
      return new AuthError("Unknown Error occurred while registering user!");
    }
  }
  checkPasswordStrength(plainPassword: string): Array<PasswordFlags> {
    const requirements = this.getPasswordRequirements()
    const flags : PasswordFlags[] = []

    const digitCount = [...plainPassword.matchAll(RegExp(/\d/g))].length
    const specialCharacters =[...plainPassword.matchAll(RegExp(/\W/g))].length
    const upperCaseCharactersCount = [...plainPassword.matchAll(RegExp(/[A-Z]/g))].length
   
    if(plainPassword.length < requirements.minimumLength){
        flags.push(PasswordFlags.MinimumLength)
    }
    if(digitCount< requirements.digitCount){
        flags.push(PasswordFlags.DigitCount)
    }
    if(specialCharacters < requirements.specialCharacterCount){
        flags.push(PasswordFlags.SpecialCharacterCount)
    }
    if(upperCaseCharactersCount < requirements.upperCaseCharactersCount){
        flags.push(PasswordFlags.UpperCaseCharactersCount)
    }

    return flags
  }
  
  getPasswordRequirements(): PasswordRequirements {
    return {
      digitCount: 3,
      specialCharacterCount: 1,
      upperCaseCharactersCount: 1,
      minimumLength: 12,
    };
  }
}

