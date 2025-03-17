import UserCredentials from "@/shared/user_credentials"

interface UserCredentialsDao{

    insertUserCredentials( credentials : UserCredentials) : Promise<Boolean>
    updateUserCredentials( credentials : UserCredentials) : Promise<Boolean>

    getCredentialsByToken( refreshToken : string)         : Promise<UserCredentials | null>
    getCredentialsByUid  (userUid : string)               : Promise<UserCredentials| null>
    getCredentialsByEmail(userEmail : string)             : Promise<UserCredentials | null>

    deleteUserCredentialsByUid(userUid : string)          : Promise<Boolean>
    deleteUserCredentialsByEmail(userEmail : string)      : Promise<Boolean>
}

export default UserCredentialsDao