import { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fff',
      borderTop: '1px solid #ddd',
      display: 'flex',
      gap: '10px',
    }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Введите сообщение..."
        disabled={disabled}
        style={{
          flex: 1,
          padding: '12px 15px',
          border: '1px solid #ddd',
          borderRadius: '24px',
          fontSize: '14px',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => e.target.style.borderColor = '#0084ff'}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        style={{
          padding: '12px 24px',
          backgroundColor: message.trim() && !disabled ? '#0084ff' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '24px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: message.trim() && !disabled ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (message.trim() && !disabled) {
            e.currentTarget.style.backgroundColor = '#0073e6';
          }
        }}
        onMouseLeave={(e) => {
          if (message.trim() && !disabled) {
            e.currentTarget.style.backgroundColor = '#0084ff';
          }
        }}
      >
        Отправить
      </button>
    </div>
  );
};
