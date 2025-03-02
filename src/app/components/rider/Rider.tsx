// src/app/components/rider/Rider.tsx
'use client';

import { useState, useEffect } from "react";
import useSocket from "@/app/hooks/useSocket";

interface Ride {
  id: number;
  sourceName: string;
  destinationName: string;
  source:{lat: number; lng: number};
  destination:{lat: number; lng: number};
  currentBid: number;
  distance: number;
  riderId: string;
}

interface BidNotification {
  rideId: number;
  newBid: number;
  driverId: string;
}

export default function Rider() {
  const riderId = "rider-" + Math.floor(Math.random() * 1000); // In a real app, from auth
  const { socket, isConnected } = useSocket(riderId);
  
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [newRideSource, setNewRideSource] = useState("");
  const [newRideDestination, setNewRideDestination] = useState("");
  const [newRideDistance, setNewRideDistance] = useState("");
  const [newRideStartingBid, setNewRideStartingBid] = useState("");
  const [bidNotifications, setBidNotifications] = useState<BidNotification[]>([]);
  
  useEffect(() => {
    if (!socket) return;
    
    // Listen for all active rides and filter mine
    socket.on('activeRides', (activeRides: Ride[]) => {
      setMyRides(activeRides.filter(ride => ride.riderId === riderId));
    });
    
    // Listen for new bids on my rides
    socket.on('newBidOnYourRide', (notification: BidNotification) => {
      setBidNotifications(prev => [...prev, notification]);
      
      // Also update the ride in my list
      setMyRides(prev => prev.map(ride => 
        ride.id === notification.rideId 
          ? { ...ride, currentBid: notification.newBid } 
          : ride
      ));
    });
    
    // Listen for ride removals
    socket.on('rideRemoved', (rideId: number) => {
      setMyRides(prev => prev.filter(ride => ride.id !== rideId));
      setBidNotifications(prev => prev.filter(n => n.rideId !== rideId));
    });
    
    return () => {
      socket.off('activeRides');
      socket.off('newBidOnYourRide');
      socket.off('rideRemoved');
    };
  }, [socket, riderId]);
  
  const createNewRide = () => {
    if (socket && isConnected) {
      const startingBid = parseFloat(newRideStartingBid);
      const distance = parseFloat(newRideDistance);
      
      if (!newRideSource || !newRideDestination || isNaN(startingBid) || isNaN(distance)) {
        alert("Please fill in all fields with valid values");
        return;
      }
      
      socket.emit('createRide', {
        source: newRideSource,
        destination: newRideDestination,
        currentBid: startingBid,
        distance: distance,
        riderId: riderId
      });
      
      // Clear form
      setNewRideSource("");
      setNewRideDestination("");
      setNewRideDistance("");
      setNewRideStartingBid("");
    }
  };
  
  const acceptBid = (rideId: number, driverId: string) => {
    if (socket && isConnected) {
      socket.emit('acceptBid', { rideId, driverId });
      setMyRides(prev => prev.filter(ride => ride.id !== rideId));
      setBidNotifications(prev => prev.filter(n => n.rideId !== rideId));
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create a New Ride Request</h1>
      
      {!isConnected && (
        <p className="text-center text-red-500 mb-4">Connecting to server...</p>
      )}
      
      <div className="p-4 border rounded shadow-md mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">From</label>
            <input
              type="text"
              value={newRideSource}
              onChange={(e) => setNewRideSource(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter pickup location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input
              type="text"
              value={newRideDestination}
              onChange={(e) => setNewRideDestination(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Enter destination"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Distance (miles)</label>
            <input
              type="number"
              value={newRideDistance}
              onChange={(e) => setNewRideDistance(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Estimated distance"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Starting Bid ($)</label>
            <input
              type="number"
              value={newRideStartingBid}
              onChange={(e) => setNewRideStartingBid(e.target.value)}
              className="border p-2 w-full rounded"
              placeholder="Maximum amount"
            />
          </div>
        </div>
        
        <button
          onClick={createNewRide}
          className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!isConnected}
        >
          Create Ride Request
        </button>
      </div>
      
      <h2 className="text-xl font-bold mb-4">Your Active Ride Requests</h2>
      
      {myRides.length === 0 ? (
        <p className="text-center py-4 text-gray-500">You have no active ride requests.</p>
      ) : (
        <ul className="space-y-4">
          {myRides.map((ride) => (
            <li key={ride.id} className="p-4 border rounded shadow-md">
              <p className="font-semibold">{ride.sourceName} → {ride.destinationName}</p>
              <div className="flex justify-between mt-2">
                <p>Current Bid: <span className="font-bold">${ride.currentBid}</span></p>
                <p>Distance: <span className="font-bold">{ride.distance} miles</span></p>
              </div>
              
              {/* Display bid notifications for this ride */}
              {bidNotifications.filter(n => n.rideId === ride.id).length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold">New Bids:</h3>
                  <ul className="divide-y">
                    {bidNotifications
                      .filter(n => n.rideId === ride.id)
                      .map((notification, index) => (
                        <li key={index} className="py-2 flex justify-between items-center">
                          <span>Driver bid: <span className="font-bold">${notification.newBid}</span></span>
                          <button
                            onClick={() => acceptBid(notification.rideId, notification.driverId)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Accept Bid
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
