import { useState } from "react";
import RideItem from "./RideItem";

interface Ride {
  id: number;
  sourceName: string;
  destinationName: string;
  source: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  currentBid: number;
  distance: number;
}

const initialRides: Ride[] = [
    {
      id: 1,
      sourceName: "New York, NY",
      destinationName: "Boston, MA",
      source: { lat: 40.7128, lng: -74.0060 },  // ✅ New York lat/lng
      destination: { lat: 42.3601, lng: -71.0589 },  // ✅ Boston lat/lng
      currentBid: 150,
      distance: 215
    },
    {
      id: 2,
      sourceName: "Los Angeles, CA",
      destinationName: "San Francisco, CA",
      source: { lat: 34.0522, lng: -118.2437 },  // ✅ LA lat/lng
      destination: { lat: 37.7749, lng: -122.4194 },  // ✅ SF lat/lng
      currentBid: 150,
      distance: 380
    }
  ];

export default function BidRides() {
  const [rides, setRides] = useState<Ride[]>(initialRides);

  const handlePlaceBid = (id: number, newBid: number) => {
    setRides(rides.map((ride) =>
      ride.id === id ? { ...ride, currentBid: newBid } : ride
    ));
  };

  const handleRemoveRide = (id: number) => {
    setRides(rides.filter(ride => ride.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Available Rides for Bidding</h1>
      {rides.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No rides available at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {rides.map((ride) => (
            <RideItem
              key={ride.id}
              id={ride.id}
              sourceName={ride.sourceName}
              destinationName={ride.destinationName}
              source={ride.source}
              destination={ride.destination}
              currentBid={ride.currentBid}
              distance={ride.distance}
              onPlaceBid={handlePlaceBid}
              onRemove={handleRemoveRide}
            />
          ))}
        </ul>
      )}
    </div>
    );
}