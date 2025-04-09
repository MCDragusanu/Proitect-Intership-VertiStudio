import type { CoinDTO } from "@/src/shared/DataTransferObjects/CoinDTO";

const ENDPOINT_URL = "http://localhost:3000/api/coins";

export type PaginationParams = {
	pageNumber: number;
	pageSize: number;
};

export function buildPaginationURL(
	endPoint: string,
	{ pageNumber, pageSize }: PaginationParams,
): string {
	const offset = (pageNumber - 1) * pageSize;
	const limit = pageSize;
	const url = new URL(endPoint);
	url.searchParams.set("offset", offset.toString());
	url.searchParams.set("limit", limit.toString());
	return url.toString();
}

export async function getFreeCoins(
	params: PaginationParams,
	onError: (message: string) => void,
): Promise<CoinDTO[]> {
	try {
		const url = buildPaginationURL(ENDPOINT_URL, params);
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			onError(`Failed to fetch: ${response.status} ${response.statusText}`);
			return [];
		}
	} catch (error: any) {
		console.error("Fetch error:", error);
		onError(error?.message || "An unexpected error occurred.");
		return [];
	}
}
