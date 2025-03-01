import { GoogleMap, Marker} from "@react-google-maps/api";
import { useEffect, useState } from "react";

// const center = {
//   lat: 37.7749, // Example latitude (San Francisco)
//   lng: -122.4194, // Example longitude (San Francisco)
// };

export default function Map() {
  const [center,setCenter] = useState({
      lat: 37.7749, // Example latitude (San Francisco)
      lng: -122.4194, // Example longitude (San Francisco)
    });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCenter({ lat:latitude, lng:longitude });
      },
      (error) => {
          console.error('Error getting user location:', error);
      }
  );
  }
  else {
      console.error('Geolocation is not supported by this browser.');
  }

  useEffect(()=>{
    console.log(center);
  },[])

  return (
    <div className="w-full h-screen rounded-lg overflow-hidden absolute bottom-0 left-0 z-0">

        <GoogleMap
          center={center}
          zoom={10}
          mapContainerClassName="w-full h-full"
          options={{disableDefaultUI:true}}
        >
          <Marker position={center} />
        </GoogleMap>
    </div>
  );
}
