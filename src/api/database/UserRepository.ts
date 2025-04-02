import UserProfile from "@/shared/user_profile";
import UserCredentials from "@/shared/user_credentials";

export default interface UserRepository{

    initialise() : Promise<void>

    insertUserProfile(profile : UserProfile)              : Promise<Boolean>
    insertUserCredentials( credentials : UserCredentials) : Promise<Boolean>
    
    updateUserCredentials( credentials : UserCredentials) : Promise<Boolean>
    updateUserProfile(profile : UserProfile)              : Promise<Boolean>
    
    getCredentialsByToken( refreshToken : string)         : Promise<UserCredentials | null>
    getCredentialsByUid  (userUid : string)               : Promise<UserCredentials | null>
    getCredentialsByEmail(userEmail : string)             : Promise<UserCredentials | null>
    getUserProfileByUid(uuid : string)                    : Promise<UserProfile | null>

    deleteUserProfileByUid(uuid : string)                 : Promise<Boolean>
    deleteUserCredentialsByUid(userUid : string)          : Promise<Boolean>
    deleteUserCredentialsByEmail(userEmail : string)      : Promise<Boolean>
}