// 'use client';
// // import BidRides from './components/BidRides';
// import Login from './auth/Login';

// export default function Home() {
//   return (
//     <main className="min-h-screen py-8">
//       <Login />
      
//     </main>
//   );
// }

// src/app/page.tsx
'use client';

import { useState } from "react";
import BidRides from "./components/driver/BidRides";
import Rider from "./components/rider/Rider";

export default function Home() {
  const [userType, setUserType] = useState<'none' | 'rider' | 'driver'>('none');
  
  if (userType === 'none') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">RideBid App</h1>
          <p className="mb-4 text-center text-gray-600">Choose your role:</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setUserType('rider')}
              className="py-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition-colors"
            >
              I'm a Rider
            </button>
            <button
              onClick={() => setUserType('driver')}
              className="py-4 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors"
            >
              I'm a Driver
            </button>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {userType === 'rider' ? 'Rider Dashboard' : 'Driver Dashboard'}
          </h1>
          <button
            onClick={() => setUserType('none')}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Switch Role
          </button>
        </div>
        
        {userType === 'rider' ? <Rider /> : <BidRides />}
      </div>
    </main>
  );
}