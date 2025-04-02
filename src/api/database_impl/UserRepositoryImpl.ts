import UserCredentials from "@/shared/user_credentials";
import  UserRepository  from "../database/UserRepository";
import SQLiteUserCredentialsDao from "./UserCredentialsDaoImpl";
import SQLiteUserProfileDao from "./UserProfileDaoImpl";
import UserProfile from "@/shared/user_profile";

export class SQLLiteUserRepository implements UserRepository{
 
    private  userCredentialsDao : SQLiteUserCredentialsDao
    private  userProfileDao : SQLiteUserProfileDao

    constructor(credentialsDao : SQLiteUserCredentialsDao , profileDao : SQLiteUserProfileDao){
        this.userCredentialsDao = credentialsDao
        this.userProfileDao = profileDao
    }

    async initialise(): Promise<void> {
        if(!this.userCredentialsDao.checkSource()){
            this.userCredentialsDao.createSource()
        }
        if(!this.userProfileDao.checkSource()){
            this.userProfileDao.createSource()
        }
    }

    async insertUserCredentials(credentials: UserCredentials): Promise<Boolean> {
        
    }
    async insertUserProfile(profile: UserProfile): Promise<Boolean> {
        
    }
    async updateUserCredentials(credentials: UserCredentials): Promise<Boolean> {
        
    }
    async updateUserProfile(profile: UserProfile): Promise<Boolean> {
        
    }
    async deleteUserCredentialsByEmail(userEmail: string): Promise<Boolean> {
        
    }
    async deleteUserCredentialsByUid(userUid: string): Promise<Boolean> {
        
    }
    async deleteUserProfileByUid(uuid: string): Promise<Boolean> {
        
    }
    async getCredentialsByEmail(userEmail: string): Promise<UserCredentials | null> {
        
    }
    async getCredentialsByToken(refreshToken: string): Promise<UserCredentials | null> {
        
    }
    async getCredentialsByUid(userUid: string): Promise<UserCredentials | null> {
        
    }
    async getUserProfileByUid(uuid: string): Promise<UserProfile | null> {
        
    }
}

