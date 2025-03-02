"use client";

import { useState } from "react";
import InputFields from "./components/input_fields/input_fields";
import UserBidingComponent from "./components/user_biding_component/user_biding_component";
import Map from "./components/map/map";
import { LoadScript, Libraries } from "@react-google-maps/api";

export default function Home() {
  const [sourceDestinationConfirmed, setSourceDestinationConfirmed ] = useState(false);
  const [routeConfirmed, setRouteConfirmed] = useState(false);

  const [tripConfirmed, setTripConfirmed] = useState(false);

  function getRouteButtonHandler() {
    if (sourceDestinationConfirmed) return;
    setSourceDestinationConfirmed(true);
  }

  function resetGetRouteButtonHandler(){
    if (!sourceDestinationConfirmed) return;
    setSourceDestinationConfirmed(false);
  }

  function routeConfirmedCallback(){
    setRouteConfirmed(true);
    console.log(routeConfirmed);
  }

  

  const [sourcePlace, setSourcePlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [destinationPlace, setDestinationPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  function sourcePlaceHandler(place: google.maps.places.PlaceResult) {
    setSourcePlace(place);
  }

  function destinationPlaceHandler(place: google.maps.places.PlaceResult) {
    setDestinationPlace(place);
  }

  const googleAPILibraries = ["places"] as Libraries;

  return (
    <div className="flex flex-col">
      <main className="flex flex-col items-center sm:items-start">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
          libraries={googleAPILibraries}
        >
          <div className="bg-slate-100/90 z-1 w-full flex flex-col justify-center items-center">
            <div className="flex justify-center">
              <svg
                fill="#000000"
                className="w-20 h-20"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M13.220703 3C12.790703 3 12.407484 3.2745938 12.271484 3.6835938L12.166016 4L10.599609 4C7.9996094 4 5.8331875 5.9939375 5.6171875 8.5859375L5.3144531 12.220703C3.9676367 12.707902 3 13.985076 3 15.5L3 21C2.448 21 2 21.448 2 22C2 22.552 2.448 23 3 23L4 23L4 24C4 25.105 4.895 26 6 26C7.105 26 8 25.105 8 24L8 23L22 23L22 24C22 25.105 22.895 26 24 26C25.105 26 26 25.105 26 24L26 23L27 23C27.552 23 28 22.552 28 22C28 21.448 27.552 21 27 21L27 15.5C27 13.985076 26.032363 12.707902 24.685547 12.220703L24.382812 8.5859375C24.166812 5.9939375 21.999437 4 19.398438 4L17.833984 4L17.728516 3.6835938C17.592516 3.2745937 17.210297 3 16.779297 3L13.220703 3 z M 10.601562 6L19.400391 6C20.948391 6 22.261625 7.2089531 22.390625 8.7519531L22.667969 12.111328C22.659598 12.113406 22.650934 12.115068 22.642578 12.117188C20.883578 11.581188 18.238 11 15 11C11.762 11 9.1164219 11.581187 7.3574219 12.117188C7.3490659 12.115068 7.340402 12.113406 7.3320312 12.111328L7.6113281 8.7519531C7.7403281 7.2089531 9.0535625 6 10.601562 6 z M 6.5 14C7.328 14 8 14.672 8 15.5C8 16.328 7.328 17 6.5 17C5.672 17 5 16.328 5 15.5C5 14.672 5.672 14 6.5 14 z M 15 14C16.657 14 18 15.343 18 17L18 20C18 20.552 17.552 21 17 21L13 21C12.448 21 12 20.552 12 20L12 17C12 15.343 13.343 14 15 14 z M 23.5 14C24.328 14 25 14.672 25 15.5C25 16.328 24.328 17 23.5 17C22.672 17 22 16.328 22 15.5C22 14.672 22.672 14 23.5 14 z"></path>
                </g>
              </svg>
              <h1 className="text-4xl p-2 m-2 "> HaggleCab</h1>
            </div>

            <InputFields
              sourcePlaceHandler={sourcePlaceHandler}
              destinationPlaceHandler={destinationPlaceHandler}
              onChange={resetGetRouteButtonHandler}
            />
          </div>

          {!tripConfirmed ? (
            <div className="w-full flex flex-col items-center ">
              <Map source={sourcePlace} destination={destinationPlace} sourceDestinationConfirmed={sourceDestinationConfirmed} routeConfirmedCallback={routeConfirmedCallback}/>
              {sourcePlace && destinationPlace && !sourceDestinationConfirmed ? (
                <button
                  onClick={getRouteButtonHandler}
                  className="border p-1 rounded-md flex m-1 w-50 items-center bg-lime-500 z-1"
                >
                  <span className="w-full">Get Route</span>
                </button>
              ) : null}
            </div>
          ) : (
            <UserBidingComponent />
          )}
        </LoadScript>
      </main>
    </div>
  );
}
