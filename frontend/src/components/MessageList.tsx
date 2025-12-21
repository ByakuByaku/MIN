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
      minute: '2-digit' 
    });
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: '#f5f5f5',
    }}>
      {messages.length === 0 ? (
        <div style={{
          textAlign: 'center',
          color: '#999',
          marginTop: '50px',
        }}>
          Нет сообщений. Начните общение!
        </div>
      ) : (
        messages.map(message => {
          const isOwnMessage = message.userId === currentUserId;
          
          return (
            <div
              key={message.id}
              style={{
                marginBottom: '15px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '70%',
                backgroundColor: isOwnMessage ? '#0084ff' : '#fff',
                color: isOwnMessage ? '#fff' : '#000',
                padding: '10px 15px',
                borderRadius: '18px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}>
                {!isOwnMessage && (
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    opacity: 0.8,
                  }}>
                    {message.userName}
                  </div>
                )}
                <div style={{ wordBreak: 'break-word' }}>
                  {message.text}
                </div>
                <div style={{
                  fontSize: '11px',
                  marginTop: '5px',
                  opacity: 0.7,
                  textAlign: 'right',
                }}>
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
