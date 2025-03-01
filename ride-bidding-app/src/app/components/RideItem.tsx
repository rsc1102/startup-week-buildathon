// src/app/components/RideItem.tsx
import Link from "next/link";
import { useState } from "react";

interface RideItemProps {
  id: number;
  sourceName: string;
  destinationName: string;
  source:{ lat: number; lng: number };
  destination:{ lat: number; lng: number };
  currentBid: number;
  distance: number;
  onPlaceBid: (id: number, newBid: number) => void;
  onRemove: (id: number) => void; // New remove function prop
}

export default function RideItem({ id, sourceName, destinationName, currentBid, distance, onPlaceBid, onRemove }: RideItemProps) {
  const [bidAmount, setBidAmount] = useState<string>("");

  const handleBidChange = (value: string) => {
    setBidAmount(value);
  };

  const incrementBid = () => {
    const currentValue = bidAmount === "" ? currentBid : Number(bidAmount);
    setBidAmount((currentValue + 1).toString());
  };

  const decrementBid = () => {
    const currentValue = bidAmount === "" ? currentBid : Number(bidAmount);
    if (currentValue > 1) { // Preventing negative bids
      setBidAmount((currentValue - 1).toString());
    }
  };

  const placeBid = () => {
    const newBid = Number(bidAmount);
    onPlaceBid(id, newBid);
    if (newBid < currentBid) {
      setBidAmount("");
    }
  };

  return (
    <li className="p-4 border rounded shadow-md relative">
        {/* Cross button in the top-right corner */}
      <button 
        onClick={() => onRemove(id)}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
        aria-label="Remove ride"
      >
        ×
      </button>
      <Link href={`/ride/${id}`} className="hover:text-blue-600 hover:underline">
        <p className="font-semibold cursor-pointer">{sourceName} → {destinationName}</p>
      </Link>
      <div className="flex justify-between mt-2">
        <p>Current Bid: <span className="font-bold">${currentBid}</span></p>
        <p>Distance: <span className="font-bold">{distance} miles</span></p>
      </div>
      <div className="flex items-center mt-2">
        <button
          onClick={decrementBid}
          className="bg-gray-200 px-3 py-2 rounded-l border-y border-l border-gray-300"
        >
          -1
        </button>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => handleBidChange(e.target.value)}
          placeholder="Enter lower bid"
          className="border-y p-2 flex-grow text-center"
        />
        <button
          onClick={incrementBid}
          className="bg-gray-200 px-3 py-2 rounded-r border-y border-r border-gray-300"
        >
          +1
        </button>
      </div>
      <button
        onClick={placeBid}
        className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        disabled={!bidAmount || Number(bidAmount) >= currentBid}
      >
        Place Bid
      </button>
    </li>
  );
}