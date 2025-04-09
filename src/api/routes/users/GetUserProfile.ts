import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { getModule } from "../../module";
import { computeBitSlow } from "@/src/bitslow";
import BitSlow from "@/src/shared/bitslow";
export const getUserInformation = async (
  req: Request,
  userUid: string
): Promise<Response> => {
  try {
    // Fetch coins related to the user
    const coins = await getModule().bitSlowRepo.getUserCoins(userUid);

    // Fetch monetary value related to the user
    const getMonetaryValue = await getModule().bitSlowRepo.getMonetaryValue(
      userUid
    );

    // Fetch user profile details based on the userUid
    const userProfile = await getModule().userRepository.getProfileByUid(
      userUid
    );

    // Check if any of the fetched data is empty or invalid
    if (
      coins === null ||
      coins === undefined || // If coins is null or undefined
      getMonetaryValue === null ||
      getMonetaryValue === undefined || // If monetary value is null or undefined
      userProfile === null ||
      userProfile === undefined // If userProfile is null or undefined
    ) {
      console.log("Information is incomplete!");
      return new Response("User information not found or incomplete", {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    //console.log("Raw Coins Retrieved : ")
    //console.log(coins)
    const processedCoins: CoinDTO[] = [];
    for (const rawCoin of coins) {
      let computedBitSlow: string | null = null;
      //check to see if it already in the database
      const preComputedBitSlow =
        await getModule().bitSlowRepo.getBitSlowByCoinId(rawCoin.coin_id);

      //if it has been chached already
      if (preComputedBitSlow) {
        computedBitSlow = preComputedBitSlow.computedBitSlow;
      } else {
        console.log("Will compute bitslow");
        // compute it for the first time
        computedBitSlow = computeBitSlow(
          rawCoin.bit1,
          rawCoin.bit2,
          rawCoin.bit3
        );
        //create a new record
        const newBitSlow: BitSlow = {
          id: Date.now(),
          coinId: rawCoin.coin_id,
          bit1: rawCoin.bit1,
          bit2: rawCoin.bit2,
          bit3: rawCoin.bit3,
          computedBitSlow: computedBitSlow,
        };
        //save it for later
        await getModule().bitSlowRepo.insertBitSlow(newBitSlow);
      }
      const processedCoin: CoinDTO = {
        ...rawCoin,
        bitSlow: computedBitSlow,
      };
      processedCoins.push(processedCoin);
    }
    // Combining all the fetched data into a single response object

    const userInformation = {
      profile: userProfile,
      ownedCoins: processedCoins,
      monetaryValue: getMonetaryValue,
    };
    console.log("User Coins : ");
    console.log(userInformation.ownedCoins);
    // Return the combined user information
    return new Response(JSON.stringify(userInformation), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error fetching user information:", err);
    return new Response(
      "Failed to fetch user information. Please try again later.",
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
