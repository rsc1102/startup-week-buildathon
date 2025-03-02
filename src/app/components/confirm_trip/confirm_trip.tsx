import { useState } from "react";

export default function ConfirmTrip({
  cancelRouteHandler,
  confirmTripHandler,
  updateMaxFareHandler,
  maxFare,
}: {
  cancelRouteHandler: () => void;
  confirmTripHandler: () => void;
  updateMaxFareHandler: (value: number) => void;
  maxFare: number;
}) {
  return (
    <div className="flex flex-col justify-center h-150 w-full">
      <h1 className="text-6xl w-full text-center m-5 p-5"> Max Fare</h1>
      <div className="flex justify-around w-full h-25 md:h-50 m-2">
        <button
          onClick={cancelRouteHandler}
          className="text-2xl md:text-4xl border m-2 p-2 rounded-4xl bg-red-500/80 hover:bg-red-600 cursor-pointer"
        >
          Cancel
        </button>
        <input
          className="text-2xl md:text-4xl border rounded-4xl text-center md:w-50 w-30"
          type="number"
          value={maxFare}
          onChange={(e) => updateMaxFareHandler(Number(e.target.value))}
          min={0}
        ></input>
        <button
          onClick={confirmTripHandler}
          className="text-2xl md:text-4xl border m-2 p-2 rounded-4xl bg-green-500/80 hover:bg-green-600 cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
