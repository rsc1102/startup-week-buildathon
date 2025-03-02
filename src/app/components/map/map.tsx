import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useEffect, useState } from "react";

export default function Map({
  source,
  destination,
  sourceDestinationConfirmed,
  routeConfirmedCallback,
}: {
  source: google.maps.places.PlaceResult | null;
  destination: google.maps.places.PlaceResult | null;
  sourceDestinationConfirmed: boolean;
  routeConfirmedCallback: () => void;
}) {
  const [center, setCenter] = useState({
    lat: 37.7749, // Example latitude (San Francisco)
    lng: -122.4194, // Example longitude (San Francisco)
  });

  const [zoom, setZoom] = useState(10);

  const [geolocationDone, setGeolocationDone] = useState(false);

  if (!geolocationDone && navigator.geolocation) {
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
  const [travelTime, setTravelTime] = useState<string | undefined>("");

  const fetchDirections = () => {
    if (!source) {
      alert("Source not identified");
      return;
    }
    if (!destination) {
      alert("Destination not identified");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    if (
      source.geometry &&
      source.geometry.location &&
      destination.geometry &&
      destination.geometry.location
    ) {
      directionsService.route(
        {
          origin: {
            lat: source.geometry.location.lat(),
            lng: source.geometry.location.lng(),
          },
          destination: {
            lat: destination.geometry.location.lat(),
            lng: destination.geometry.location.lng(),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const newCenter = findRouteCenter(result);
            setCenter(newCenter);
            setTravelTime(result?.routes[0].legs[0].duration?.text);
          } else {
            console.error("Error fetching directions:", status);
          }
        }
      );
    }
  };

  // Function to calculate the center of the route
  const findRouteCenter = (
    directions: google.maps.DirectionsResult | null
  ): google.maps.LatLngLiteral => {
    if (!directions) return center;
    if (!directions.routes.length) return center;

    const route = directions.routes[0]; // Get first route
    const path = route.overview_path; // Get the full polyline path

    if (path.length === 0) return center;

    const middleIndex = Math.floor(path.length / 2 - path.length / 10); // Get the middle point
    const midpoint = path[middleIndex];

    return { lat: midpoint.lat(), lng: midpoint.lng() };
  };

  useEffect(() => {
    console.log(center);
    if (sourceDestinationConfirmed) {
      fetchDirections();
      setZoom(12);
    }
  }, [geolocationDone, sourceDestinationConfirmed]);

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden absolute bottom-0 left-0 z-0">
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerClassName="w-full h-full"
        options={{ disableDefaultUI: true }}
      >
        {directions ? (
          <DirectionsRenderer
            directions={directions}
            options={{ polylineOptions: { strokeColor: "#FF0000" } }}
          />
        ) : (
          <Marker position={center} />
        )}
      </GoogleMap>
      {directions ? (
        <div className=" fixed bottom-10 w-full flex justify-center  bg-slate-50/80 z-1">
          <div className="flex flex-col">
            <h1 className="text-center text-4xl">Travel Time</h1>
            <h1 className="text-center text-6xl">{travelTime}</h1>
            <button
              onClick={routeConfirmedCallback}
              className="text-center text-2xl border m-2 p-2 rounded-xl bg-green-700/90 hover:bg-green-800/90 active:bg-green-800/90 text-white cursor-pointer"
            >
              Confirm Route
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
