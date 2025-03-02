// src/app/hooks/useSocket.ts
'use client';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
}

export default function useSocket(userId?: string): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io('http://localhost:3001', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000
      });
    
    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      
      // If a userId is provided, identify the user to the server
      if (userId) {
        socketInstance.emit('identify', userId);
      }
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });
    
    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });
    
    setSocket(socketInstance);
    
    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);

  return { socket, isConnected };
}