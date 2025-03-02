// import { Server } from "socket.io";
// import { NextRequest } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// let io: Server | null = null;

// interface Ride {
//     id: number;
//     sourceName: string;
//     destinationName: string;
//     source: {lat: number; lng: number};
//     destination: {lat: number; lng: number};
//     currentBid: number;
//     distance: number;
//     riderId: string;
// }

// interface BidEvent {
//     rideId: number;
//     driverId: string;
//     bidAmount: number;
// }

// //api calls
// let activeRides: Ride[] = [
//     {
//       id: 1,
//       sourceName: "New York, NY",
//       destinationName: "Boston, MA",
//       source: { lat: 40.7128, lng: -74.0060 },  // ✅ New York lat/lng
//       destination: { lat: 42.3601, lng: -71.0589 },  // ✅ Boston lat/lng
//       currentBid: 150,
//       distance: 215,
//       riderId: "rider123"
//     },
//     {
//       id: 2,
//       sourceName: "Los Angeles, CA",
//       destinationName: "San Francisco, CA",
//       source: { lat: 34.0522, lng: -118.2437 },  // ✅ LA lat/lng
//       destination: { lat: 37.7749, lng: -122.4194 },  // ✅ SF lat/lng
//       currentBid: 150,
//       distance: 380,
//       riderId: "rider456"
//     }
// ];

// export default async function handler(req: NextRequest) {
//   if (!io) {
//     io = new Server(3001, {
//       cors: {
//         origin: "*",
//       },
//     });

//     io.on("connection", (socket) => {
//         console.log("A user connected:", socket.id);
        
//         // Send all active rides to newly connected clients
//         socket.emit("activeRides", activeRides);
        
//         // Handle new ride creation (from riders)
//         socket.on("createRide", (rideData: Omit<Ride, "id">) => {
//           const newRide: Ride = {
//             ...rideData,
//             id: Date.now(), // Simple way to generate unique IDs
//           };
          
//           activeRides.push(newRide);
          
//           // Broadcast the new ride to all connected users
//           io?.emit("newRide", newRide);
//           console.log("New ride created:", newRide);
//         });
        
//         // Handle bid events from drivers
//         socket.on("placeBid", (bidData: BidEvent) => {
//           const { rideId, driverId, bidAmount } = bidData;
          
//           // Find the ride being bid on
//           const rideIndex = activeRides.findIndex(ride => ride.id === rideId);
          
//           if (rideIndex !== -1 && bidAmount < activeRides[rideIndex].currentBid) {
//             // Update the ride with the new bid
//             activeRides[rideIndex].currentBid = bidAmount;
            
//             // Emit the updated ride to all clients
//             io?.emit("rideBidUpdated", {
//               rideId,
//               newBid: bidAmount,
//               driverId
//             });
            
//             // Specifically notify the ride owner
//             io?.to(activeRides[rideIndex].riderId).emit("newBidOnYourRide", {
//               rideId,
//               newBid: bidAmount,
//               driverId
//             });
            
//             console.log(`New bid of $${bidAmount} placed on ride #${rideId} by driver ${driverId}`);
//           }
//         });
        
//         // Handle ride removal
//         socket.on("removeRide", (rideId: number) => {
//           activeRides = activeRides.filter(ride => ride.id !== rideId);
//           io?.emit("rideRemoved", rideId);
//           console.log(`Ride #${rideId} removed`);
//         });
        
//         // Handle bid acceptance (rider accepts a driver's bid)
//         socket.on("acceptBid", (data: { rideId: number, driverId: string }) => {
//           const { rideId, driverId } = data;
//           io?.emit("bidAccepted", { rideId, driverId });
          
//           // Notify the specific driver
//           io?.to(driverId).emit("yourBidAccepted", rideId);
          
//           // Remove the ride from active rides
//           activeRides = activeRides.filter(ride => ride.id !== rideId);
          
//           console.log(`Bid accepted for ride #${rideId} by driver ${driverId}`);
//         });
        
//         // Join a user-specific room for direct messages
//         socket.on("identify", (userId: string) => {
//           socket.join(userId);
//           console.log(`User ${socket.id} identified as ${userId}`);
//         });
        
//         socket.on("disconnect", () => {
//           console.log("User disconnected:", socket.id);
//         });
//       });
      
//       console.log("WebSocket server started on port 3001");
//     }
    
//     return new Response("WebSocket server running");
// }