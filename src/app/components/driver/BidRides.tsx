// src/app/components/driver/BidRides.tsx
'use client';

import { useState, useEffect } from "react";
import RideItem from "./RideItem";
import useSocket from "@/app/hooks/useSocket";

interface Ride {
  id: number;
  sourceName: string;
  destinationName: string;
  source: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  currentBid: number;
  distance: number;
  riderId: string;
}

export default function BidRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  // const driverId = "driver-" + Math.floor(Math.random() * 1000); // In a real app, this would come from auth
  const [driverId] = useState(() => "driver-" + Math.floor(Math.random() * 1000));

  const { socket, isConnected } = useSocket(driverId);
  
  useEffect(() => {
    if (!socket) return;
    
    const handleActiveRides = (activeRides: Ride[]) => setRides(activeRides);
    const handleNewRide = (newRide: Ride) => setRides(prev => [...prev, newRide]);
    const handleRideBidUpdated = ({ rideId, newBid }: { rideId: number; newBid: number }) => {
      setRides(prev => prev.map(ride => 
        ride.id === rideId ? { ...ride, currentBid: newBid } : ride
      ));
    };
    const handleRideRemoved = (rideId: number) => {
      setRides(prev => prev.filter(ride => ride.id !== rideId));
    };
    const handleBidAccepted = ({ rideId }:{ rideId: number }) => {
      setRides(prev => prev.filter(ride => ride.id !== rideId));
    };
    const handleYourBidAccepted = (rideId: number) => {
      alert(`Your bid for the ride from ${rides.find(r => r.id === rideId)?.sourceName} to ${rides.find(r => r.id === rideId)?.destinationName} has been accepted!`);
    };

    socket.on('activeRides', handleActiveRides);
    socket.on('newRide', handleNewRide);
    socket.on('rideBidUpdated', handleRideBidUpdated);
    socket.on('rideRemoved', handleRideRemoved);
    socket.on('bidAccepted', handleBidAccepted);
    socket.on('yourBidAccepted', handleYourBidAccepted);

    return () => {
      socket.off('activeRides', handleActiveRides);
      socket.off('newRide', handleNewRide);
      socket.off('rideBidUpdated', handleRideBidUpdated);
      socket.off('rideRemoved', handleRideRemoved);
      socket.off('bidAccepted', handleBidAccepted);
      socket.off('yourBidAccepted', handleYourBidAccepted);
    };
  }, [socket]); // ✅ Remove `rides` from dependencies
  
  const handlePlaceBid = (id: number, newBid: number) => {
    if (socket && isConnected) {
      socket.emit('placeBid', {
        rideId: id,
        driverId,
        bidAmount: newBid
      });
    }
  };

  const handleRemoveRide = (id: number) => {
    if (socket && isConnected) {
      socket.emit('removeRide', id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Available Rides for Bidding</h1>
      {!isConnected && (
        <p className="text-center text-red-500 mb-4">Connecting to server...</p>
      )}
      {isConnected && rides.length === 0 ? (
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