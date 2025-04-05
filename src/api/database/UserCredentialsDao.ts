import UserCredentials from "@/shared/user_credentials"

interface UserCredentialsDao{
    createSource() : void
    deleteSource() : void
    clearSource() : void
    checkSource() : Boolean
    
    insertUserCredentials( credentials : UserCredentials) : Promise<Boolean>
    updateUserCredentials( credentials : UserCredentials) : Promise<Boolean>
    
    updateRefreshToken(userUid : string , token : string | null) : Promise<Boolean>

    getCredentialsByToken( refreshToken : string)         : Promise<UserCredentials | null>
    getCredentialsByUid  (userUid : string)               : Promise<UserCredentials | null>
    getCredentialsByEmail(userEmail : string)             : Promise<UserCredentials | null>

    deleteUserCredentialsByUid(userUid : string)          : Promise<Boolean>
    deleteUserCredentialsByEmail(userEmail : string)      : Promise<Boolean>
}

export default UserCredentialsDao