import { useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Message, User } from '../types';

interface UseChatProps {
  socket: Socket | null;
  isConnected: boolean;
}

export const useChat = ({ socket, isConnected }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Получение списка пользователей
    socket.on('users:list', (userList: User[]) => {
      console.log('[chat] users list:', userList);
      setUsers(userList);
    });

    // Новый пользователь подключился
    socket.on('user:joined', (user: User) => {
      console.log('[chat] user joined:', user);
      setUsers(prev => {
        // Проверяем что пользователь еще не в списке
        if (prev.some(u => u.id === user.id)) {
          return prev;
        }
        return [...prev, user];
      });
    });

    // Пользователь отключился
    socket.on('user:left', (userId: string) => {
      console.log('[chat] user left:', userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
    });

    // Получение истории сообщений
    socket.on('messages:history', (history: Message[]) => {
      console.log('[chat] messages history:', history);
      setMessages(history);
    });

    // Новое сообщение
    socket.on('message:new', (message: Message) => {
      console.log('[chat] new message:', message);
      setMessages(prev => [...prev, message]);
    });

    // Текущий пользователь
    socket.on('user:current', (user: User) => {
      console.log('[chat] current user:', user);
      setCurrentUser(user);
    });

    return () => {
      socket.off('users:list');
      socket.off('user:joined');
      socket.off('user:left');
      socket.off('messages:history');
      socket.off('message:new');
      socket.off('user:current');
    };
  }, [socket, isConnected]);

  const sendMessage = useCallback((text: string) => {
    if (!socket || !isConnected || !text.trim()) return;
    
    socket.emit('message:send', { text: text.trim() });
  }, [socket, isConnected]);

  const setNickname = useCallback((nick: string) => {
    if (!socket || !isConnected || !nick.trim()) return;
    
    socket.emit('user:set-nick', { nick: nick.trim() });
  }, [socket, isConnected]);

  return {
    messages,
    users,
    currentUser,
    sendMessage,
    setNickname,
  };
};
