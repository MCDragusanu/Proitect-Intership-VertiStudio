import UserProfile from "@/shared/user_profile";
import UserProfileDao from "../database/UserProfileDao";

export default class SQLiteUserProfileDao implements UserProfileDao{
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

    insertUserProfile(profile: UserProfile): Promise<Boolean> {
        
    }
    updateUserProfile(profile: UserProfile): Promise<Boolean> {
        
    }
    deleteUserProfileByUid(uuid: string): Promise<Boolean> {
        
    }
    getUserProfileByUid(uuid: string): Promise<UserProfile | null> {
        
    }
}