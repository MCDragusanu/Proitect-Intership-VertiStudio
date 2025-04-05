import UserProfile from "@/src/shared/user_profile"

interface UserProfileDao{
   
    
    insertUserProfile(profile : UserProfile)     : Promise<boolean>
    updateUserProfile(profile : UserProfile)     : Promise<boolean>

    getUserProfileByUid(uuid : string)           : Promise<UserProfile | null>
    deleteUserProfileByUid(uuid : string)        : Promise<boolean>
    
}

export default UserProfileDao