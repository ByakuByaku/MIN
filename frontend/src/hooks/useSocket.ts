import { useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Подключаемся напрямую к backend на 3001
const SOCKET_URL = 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((nickname: string) => {
    // Если уже подключен, отключаемся
    if (socket) {
      socket.disconnect();
    }

    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: {
        nickname: nickname
      }
    });

    socketInstance.on('connect', () => {
      console.log('[socket] connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[socket] disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [socket]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  return { socket, isConnected, connect, disconnect };
};
