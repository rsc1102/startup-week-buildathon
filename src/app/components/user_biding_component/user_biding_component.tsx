"use client"

import NumberInput from "./number_input/number_input";
import Button from "./button/button";
import { useState } from "react";

export default function UserBidingComponent() {
  let [bidvalue, setBidvalue] = useState(0);

  function incrementBid() {
    setBidvalue(bidvalue + 1);
  }

  function decrementBid() {
    if (bidvalue === 0) return;
    setBidvalue(bidvalue - 1);
  }

  function setValue(value:number){
    if(value < 0) return;
    setBidvalue(value);
  }

  return (
    <div>
      <Button
        onClick={decrementBid}
        svg={
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 2"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h16"
            />
          </svg>
        }
      />
      <NumberInput value={bidvalue} onChange={setValue}/>
      <Button
      onClick={incrementBid}
        svg={
          <svg
            className="w-3 h-3 text-gray-900 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
        }
      />
    </div>
  );
}
