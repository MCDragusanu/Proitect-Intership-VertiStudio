interface UserProfile{
    userUid : string,
    firstName : string
    lastName : string,
    accountCreationDate : string,
    phoneNumber : string | null // phone name with prefix etc
    country : string | null,
    city : string | null,
}

export default UserProfile