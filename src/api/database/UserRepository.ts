import UserProfile from "@/shared/user_profile";
import UserCredentials from "@/shared/user_credentials";

export default interface UserRepository{

    
    insertProfile(profile : UserProfile)              : Promise<Boolean>
    insertCredentials( credentials : UserCredentials) : Promise<Boolean>
    
    updateCredentials( credentials : UserCredentials) : Promise<Boolean>
    updateProfile(profile : UserProfile)              : Promise<Boolean>
    
    getUserCredentialsByToken( refreshToken : string)         : Promise<UserCredentials | null>
    getUserCredentialsByUid  (userUid : string)               : Promise<UserCredentials | null>
    getUserCredentialsByEmail(userEmail : string)             : Promise<UserCredentials | null>
    getProfileByUid(uuid : string)                    : Promise<UserProfile | null>

    deletProfileByUid(uuid : string)                 : Promise<Boolean>
    deleteCredentialsByUid(userUid : string)          : Promise<Boolean>
    deleteCredentialsByEmail(userEmail : string)      : Promise<Boolean>
}