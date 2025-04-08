import { getModule } from "../../module";

export const getUserInformation = async (req: Request, userUid: string): Promise<Response> => {
    try {
        // Fetch coins related to the user
        const coins = await getModule().bitSlowRepo.getUserCoins(userUid);
        
        // Fetch monetary value related to the user
        const getMonetaryValue = await getModule().bitSlowRepo.getMonetaryValue(userUid);
        
        // Fetch user profile details based on the userUid
        const userProfile = await getModule().userRepository.getProfileByUid(userUid);

        

        // Check if any of the fetched data is empty or invalid
        if (
            (coins === null  || coins === undefined)  || // If coins is null or undefined
            (getMonetaryValue === null || getMonetaryValue === undefined)|| // If monetary value is null or undefined
            (userProfile === null || userProfile === undefined) // If userProfile is null or undefined
        ) {
            console.log("Information is incomplete!");
            return new Response("User information not found or incomplete", {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Combining all the fetched data into a single response object
        const userInformation = {
            profile: userProfile,
            ownedCoins: coins,
            monetaryValue: getMonetaryValue,
        };

      
    

        // Return the combined user information
        return new Response(JSON.stringify(userInformation), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (err) {
        console.error("Error fetching user information:", err);
        return new Response("Failed to fetch user information. Please try again later.", {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
