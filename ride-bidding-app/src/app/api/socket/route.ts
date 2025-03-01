import { Server } from "socket.io";
import { NextRequest } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: Server | null = null;

export default async function handler(req: NextRequest) {
  if (!io) {
    io = new Server(3001, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io?.emit("receiveMessage", data);
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("WebSocket server started on port 3001");
  }

  return new Response("WebSocket server running");
}
