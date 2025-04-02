interface UserCredentials{
    userUid : string
    userEmail : string
    hashedPassword : string
    refreshToken : string | null
    phoneNumber : string | null // phone name with prefix etc
    lastLogin : string | null
    userRole :  "client" | "admin"
}

export default UserCredentials