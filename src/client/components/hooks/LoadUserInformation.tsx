import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchUserInformation } from "../../requrests/getUserInformation";
import { fetchAccessToken } from "../../requrests/RefreshToken";
import { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";
import { PaginationParams } from "../../requrests/GetAllCoins";

interface UserProfileData {
	coins: CoinDTO[];
	profile: any;
	monetaryValue: number;
	totalTransactions: number;
	totalCoins: number;
}

export function useProfileInformation(
	userUid: string,
	accessToken: string,

	onErrorCallback: (message: string) => void,
	unAuthorizedAccessCallback: (message: string) => void,
) {
	const [pageParams, setPageParams] = useState<PaginationParams>({
		pageNumber: 1,
		pageSize: 30,
	});
	const [coins, setCoins] = useState<CoinDTO[]>([]);
	const [profile, setProfile] = useState<any>({});
	const [monetaryValue, setMonetaryValue] = useState<number>(0);
	const [transactionAmount, setAmount] = useState(0);
	const [coinCount, setCoinAmount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const handleError = (error: Error) => {
		setError(error);
		setLoading(false);
		onErrorCallback(
			error.message || "Unknown error occurred while getting user information",
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log("Fetch User Info invoked");
				const data: UserProfileData = await fetchUserInformation(
					userUid,
					accessToken,
					pageParams,
					(message) => handleError(new Error(message)),
					unAuthorizedAccessCallback,
				);
				if (data === null) {
					return;
				}
				console.log("useUserInfo : ");
				console.log(data);
				setCoins(data.coins);
				setMonetaryValue(data.monetaryValue);
				setProfile(data.profile);
				setAmount(data.totalTransactions);
				setCoinAmount(data.totalCoins);
				setLoading(false);
			} catch (err) {
				handleError(err as Error);
			}
		};

		fetchData();
	}, [userUid, accessToken, pageParams]);

	return {
		coins,
		pageParams,
		profile,
		coinCount,
		monetaryValue,
		transactionAmount,
		loading,
		error,
		setPageParams,
	};
}
