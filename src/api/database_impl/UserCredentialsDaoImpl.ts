import UserCredentials from "@/shared/user_credentials";
import UserCredentialsDao from "../database/UserCredentialsDao";

export default class SQLiteUserCredentialsDao implements UserCredentialsDao{
    constructor(){

    }
    createSource(): void {
        
    }
    deleteSource(): void {
        
    }
    clearSource(): void {
        
    }
    checkSource(): Boolean {
        
    }
    insertUserCredentials(credentials: UserCredentials): Promise<Boolean> {
        
    }
    updateUserCredentials(credentials: UserCredentials): Promise<Boolean> {
        
    }
    getCredentialsByEmail(userEmail: string): Promise<UserCredentials | null> {
        
    }
    getCredentialsByToken(refreshToken: string): Promise<UserCredentials | null> {
        
    }
    getCredentialsByUid(userUid: string): Promise<UserCredentials | null> {
        
    }
    deleteUserCredentialsByEmail(userEmail: string): Promise<Boolean> {
        
    }
    deleteUserCredentialsByUid(userUid: string): Promise<Boolean> {
        
    }
}