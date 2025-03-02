'use client';
// import BidRides from './components/BidRides';
import Login from './auth/Login';

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <Login />
      
      {/* <BidRides /> */}
    </main>
  );
}