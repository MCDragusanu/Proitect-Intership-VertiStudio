import React from "react";
import { toast } from "react-toastify";
import { PlusCircleIcon, CoinsIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
type Props = {
  createNewCoin : () => void;
  remainingItem : number
}
const CreateCoinCard : React.FC<Props> = ({
  createNewCoin,
  remainingItem
}) => {
  return (
    <section className="bg-white p-6 rounded-2xl items-center justify-center shadow-md flex flex-col h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full opacity-30"></div>
      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-yellow-50 rounded-full opacity-30"></div>
      
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
        
        <div className="flex items-center mt-2 bg-red-50 p-2 rounded-lg">
          <CoinsIcon className="w-4 h-4 text-red-500 mr-2" />
          <p className="text-red-500 font-semibold text-sm">
            Hurry up – only <span className="underline">{remainingItem} coins</span> left to be discovered!
          </p>
        </div>
      </div>
      
      
      
      {/* Centered button container */}
      <div className="flex justify-center items-center relative z-10">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl 
                    text-base font-medium transition-all shadow-lg flex items-center gap-2
                    hover:scale-105 active:scale-95 duration-200"
          onClick={() => createNewCoin()}
        >
          <PlusCircleIcon className="w-5 h-5" />
          Generate New Coin
        </button>
      </div>
      
      {/* Extra decoration */}
      <div className="absolute right-10 top-1/2 w-3 h-3 bg-yellow-300 rounded-full opacity-30"></div>
      <div className="absolute left-12 bottom-12 w-4 h-4 bg-green-300 rounded-full opacity-30"></div>
    </section>
  );
};

export default CreateCoinCard;