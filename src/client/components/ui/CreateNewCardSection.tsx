import React from "react";
import {
	PlusCircleIcon,
	CoinsIcon,
	SparklesIcon,
	TrendingUpIcon,
	AlertCircleIcon,
	LockIcon,
	TimerIcon,
	BarChartIcon,
} from "lucide-react";

type Props = {
	createNewCoin: () => void;
	remainingItem: number;
};

const CreateCoinCard: React.FC<Props> = ({ createNewCoin, remainingItem }) => {
	console.log("Remaining items : " + remainingItem);
	// If there are no remaining coins, show a different UI
	if (remainingItem <= 0) {
		return (
			<section className="bg-gray-100 p-6 rounded-2xl items-center justify-center shadow-md flex flex-col h-full relative overflow-hidden">
				{/* Background decoration for sold out state */}
				<div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full opacity-30"></div>
				<div className="absolute -left-4 -bottom-4 w-16 h-16 bg-gray-200 rounded-full opacity-40"></div>

				<div className="flex flex-col gap-3 mb-8 relative z-10 text-center">
					<div className="flex items-center justify-center gap-2">
						<div className="bg-red-50 p-2 rounded-lg">
							<LockIcon className="text-red-500 w-5 h-5" />
						</div>
						<h2 className="text-xl font-semibold text-gray-600">
							Mining Complete
						</h2>
					</div>

					<h1 className="text-2xl font-bold text-gray-700 flex items-center justify-center gap-2">
						All Coins Discovered!
						<AlertCircleIcon className="w-5 h-5 text-red-400" />
					</h1>

					<div className="bg-gray-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto my-4">
						<CoinsIcon className="w-8 h-8 text-gray-500" />
					</div>

					<p className="text-gray-600 text-sm mt-2 max-w-sm">
						Our miners have discovered all available coins in this round. Check
						back soon for the next mining opportunity!
					</p>
				</div>

				{/* Disabled button */}
				<div className="flex justify-center items-center relative z-10">
					<button
						className="bg-gray-400 text-white px-8 py-3 rounded-xl 
                    text-base font-medium cursor-not-allowed opacity-80 flex items-center gap-2"
						disabled
					>
						<LockIcon className="w-5 h-5" />
						Sold Out
					</button>
				</div>
			</section>
		);
	}

	// Original UI with remaining coins
	return (
		<section className="bg-white p-6 rounded-2xl items-center justify-center shadow-md flex flex-col h-full relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full opacity-30"></div>
			<div className="absolute -left-4 -bottom-4 w-16 h-16 bg-yellow-50 rounded-full opacity-30"></div>
			<div className="absolute right-1/3 top-1/4 w-10 h-10 bg-blue-50 rounded-full opacity-20"></div>

			{/* Sparkle effects */}
			<div className="absolute left-10 top-10 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
			<div className="absolute right-16 bottom-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
			<div className="absolute right-24 top-12 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>

			<div className="flex flex-col gap-3 mb-8 relative z-10">
				<div className="flex items-center gap-2">
					<div className="bg-green-50 p-2 rounded-lg">
						<PlusCircleIcon className="text-green-500 w-5 h-5" />
					</div>
					<h2 className="text-xl font-semibold">Create New Coin</h2>
				</div>

				<h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
					Strike Gold with Every Click!
					<SparklesIcon className="w-5 h-5 text-yellow-400" />
				</h1>

				<div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
					<TrendingUpIcon className="w-4 h-4 text-green-500" />
					<p>It might take a moment... but it's 300% worth the wait.</p>
				</div>

				{/* Mining statistics */}
				<div className="grid grid-cols-2 gap-2 my-3">
					<div className="bg-green-50 p-3 rounded-lg">
						<p className="text-xs text-green-700 font-medium">SUCCESS RATE</p>
						<div className="flex items-center">
							<BarChartIcon className="w-4 h-4 text-green-600 mr-1" />
							<p className="font-bold text-green-700">98.2%</p>
						</div>
					</div>
					<div className="bg-blue-50 p-3 rounded-lg">
						<p className="text-xs text-blue-700 font-medium">
							AVG. MINING TIME
						</p>
						<div className="flex items-center">
							<TimerIcon className="w-4 h-4 text-blue-600 mr-1" />
							<p className="font-bold text-blue-700">12.4s</p>
						</div>
					</div>
				</div>

				{/* Alert banner with countdown */}
				<div
					className={`flex items-center mt-2 ${remainingItem <= 5 ? "bg-red-50" : "bg-yellow-50"} p-3 rounded-lg`}
				>
					<CoinsIcon
						className={`w-4 h-4 ${remainingItem <= 5 ? "text-red-500" : "text-yellow-600"} mr-2`}
					/>
					<p
						className={`${remainingItem <= 5 ? "text-red-500" : "text-yellow-700"} font-semibold text-sm`}
					>
						{remainingItem <= 5 ? (
							<>
								Critical alert – only{" "}
								<span className="underline font-bold">
									{remainingItem} coins
								</span>{" "}
								left to be discovered!
							</>
						) : (
							<>
								Hurry up – only{" "}
								<span className="underline">{remainingItem} coins</span> left to
								be discovered!
							</>
						)}
					</p>
				</div>
			</div>

			{/* Centered button container */}
			<div className="flex justify-center items-center relative z-10">
				<button
					className={`${remainingItem <= 5 ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} 
                    text-white px-8 py-3 rounded-xl
                    text-base font-medium transition-all shadow-lg flex items-center gap-2
                   hover:scale-105 active:scale-95 duration-200`}
					onClick={() => createNewCoin()}
				>
					<PlusCircleIcon className="w-5 h-5" />
					{remainingItem <= 5 ? "Mine Last Coins Now!" : "Generate New Coin"}
				</button>
			</div>

			{/* Extra decoration */}
			<div className="absolute right-10 top-1/2 w-3 h-3 bg-yellow-300 rounded-full opacity-30"></div>
			<div className="absolute left-12 bottom-12 w-4 h-4 bg-green-300 rounded-full opacity-30"></div>
		</section>
	);
};

export default CreateCoinCard;
