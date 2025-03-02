"use client";

import { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";


export default function TextInput({
  onPlaceSelect,
  placeholder,
  svg,
  onChange,
  inputDisabled
}: {
  onPlaceSelect:(place:google.maps.places.PlaceResult)=>void,
  placeholder: string;
  svg: React.ReactNode;
  onChange: () => void;
  inputDisabled:boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  function focusHandler() {
    inputRef.current?.focus();
  }

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);


  const onLoad = (auto : google.maps.places.Autocomplete) => {
    setAutocomplete(auto);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        onPlaceSelect(place);
      }
    }
  };

  return (
    <div
      className="border p-1 rounded-md flex m-1 w-full md:w-100"
      onClick={focusHandler}
    >
      {svg}
      
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} className="w-full">
          <input
            placeholder={placeholder}
            ref={inputRef}
            className="focus:ring-0 focus:outline-none w-full truncate"
            onChange={onChange}
            disabled={inputDisabled}
          ></input>
        </Autocomplete>
    </div>
  );
}
