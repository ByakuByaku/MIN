import { useEffect, useRef } from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="messages-empty">
          Нет сообщений. Начните общение!
        </div>
      ) : (
        messages.map(message => {
          const isOwnMessage = message.userId === currentUserId;
          
          return (
            <div
              key={message.id}
              className={`message ${isOwnMessage ? 'own' : 'other'}`}
            >
              <div className="message-bubble">
                {!isOwnMessage && (
                  <div className="message-author">
                    {message.userName}
                  </div>
                )}
                <div>
                  {message.text}
                </div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
