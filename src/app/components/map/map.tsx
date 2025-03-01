import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

export default function Map({
  source,
  destination,
  routeConfirmed,
}: {
  source: google.maps.places.PlaceResult | null;
  destination: google.maps.places.PlaceResult | null;
  routeConfirmed: boolean;
}) {
  const [center, setCenter] = useState({
    lat: 37.7749, // Example latitude (San Francisco)
    lng: -122.4194, // Example longitude (San Francisco)
  });

  const [geolocationDone, setGeolocationDone] = useState(false);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat: latitude, lng: longitude });
        setGeolocationDone(true);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const fetchDirections = () => {
    if (!source || !destination) return;

    const directionsService = new google.maps.DirectionsService();

    if(source.geometry && source.geometry.location && destination.geometry && destination.geometry.location){
      directionsService.route(
        {
          origin: { lat:source.geometry.location.lat(), lng:source.geometry.location.lng() },
          destination: { lat:destination.geometry.location.lat(), lng:destination.geometry.location.lng() },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const newCenter = findRouteCenter(result);
            setCenter(newCenter);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  // Function to calculate the center of the route
  const findRouteCenter = (directions: google.maps.DirectionsResult|null): google.maps.LatLngLiteral => {
    if(!directions) return center;
    if (!directions.routes.length) return center;

    const route = directions.routes[0]; // Get first route
    const path = route.overview_path; // Get the full polyline path

    if (path.length === 0) return center;

    const middleIndex = Math.floor(path.length / 2); // Get the middle point
    const midpoint = path[middleIndex];

    return { lat: midpoint.lat(), lng: midpoint.lng() };
  };

  useEffect(() => {
    console.log(center);
    if(routeConfirmed){
      fetchDirections();
    }
  }, [geolocationDone, routeConfirmed]);

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden absolute bottom-0 left-0 z-0">
      <GoogleMap
        center={center}
        zoom={10}
        mapContainerClassName="w-full h-full"
        options={{ disableDefaultUI: true }}
      >
        
        {directions ? <DirectionsRenderer directions={directions} /> : <Marker position={center} />}
      </GoogleMap>
    </div>
  );
}
