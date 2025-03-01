'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GoogleMap, LoadScript, DirectionsRenderer } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API!; // Replace with your API Key

interface Ride {
    id: number;
    sourceName: string;
    destinationName: string;
    source: { lat: number; lng: number };  // ✅ Use lat/lng instead of a string
    destination: { lat: number; lng: number };  // ✅ Use lat/lng instead of a string
    currentBid: number;
    distance: number;
}

// This would be replaced with an API call in a real application
const getRideData = (id: number): Ride | undefined => {
    const rides: Ride[] = [
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
    return rides.find(ride => ride.id === id);
  };
  

export default function RideDetails() {
  const params = useParams();
  const [ride, setRide] = useState<Ride | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const rideId = parseInt(params.id as string);
      const foundRide = getRideData(rideId);
      if (foundRide) {
        setRide(foundRide);
      }
      setLoading(false);
    }
  }, [params.id]);

  // Fetch directions between source and destination
  const fetchDirections = (map: google.maps.Map) => {
    if (!ride) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: ride.source,
        destination: ride.destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      }
    );
  };

  if (!ride) {
    return <div className="max-w-2xl mx-auto p-4">Ride not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        &larr; Back to available rides
      </Link>

      <div className="border rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Ride Details</h1>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Route</h2>
          <p className="text-lg">{ride.sourceName} to {ride.destinationName}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Distance</h2>
          <p className="text-lg">{ride.distance} miles</p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Current Bid</h2>
          <p className="text-lg text-green-600 font-bold">${ride.currentBid}</p>
        </div>

        {/* GOOGLE MAPS */}
        <div className="mt-6 w-full h-96">
          <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            // onLoad={() => console.log("Google Maps Loaded")}
          >
            <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                zoom={6}
                center={ride?.source || { lat: 40.7128, lng: -74.006 }}  // ✅ Center on the ride's source
                onLoad={fetchDirections}
                >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </LoadScript>
        </div>

        <div className="mt-6">
          <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Return to Bidding
          </Link>
        </div>
      </div>
    </div>
  );
}