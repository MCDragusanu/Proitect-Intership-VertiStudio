import UserProfile from "@/shared/user_profile"

interface UserProfileDao{
    createSource() : void
    deleteSource() : void
    clearSource() : void
    checkSource() : Boolean
    
    insertUserProfile(profile : UserProfile)     : Promise<Boolean>
    updateUserProfile(profile : UserProfile)     : Promise<Boolean>

    getUserProfileByUid(uuid : string)           : Promise<UserProfile | null>
    deleteUserProfileByUid(uuid : string)        : Promise<Boolean>
    
}

export default UserProfileDao