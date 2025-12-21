import { useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserList } from './UserList';
import { useChat } from '../hooks/useChat';
import { Socket } from 'socket.io-client';

interface ChatWindowProps {
  socket: Socket | null;
  isConnected: boolean;
}

export const ChatWindow = ({ socket, isConnected }: ChatWindowProps) => {
  const { messages, users, currentUser, sendMessage, setNickname } = useChat({
    socket,
    isConnected,
  });

  const [nickname, setNicknameInput] = useState('');
  const [hasSetNickname, setHasSetNickname] = useState(false);

  const handleSetNickname = () => {
    if (nickname.trim()) {
      setNickname(nickname.trim());
      setHasSetNickname(true);
    }
  };

  const handleNicknameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSetNickname();
    }
  };

  // Если пользователь еще не установил никнейм
  if (!hasSetNickname) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%',
        }}>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>
            Добро пожаловать в MIN Chat!
          </h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Введите ваш никнейм для входа в чат
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNicknameInput(e.target.value)}
              onKeyPress={handleNicknameKeyPress}
              placeholder="Ваш никнейм"
              autoFocus
              style={{
                padding: '12px 15px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#0084ff'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <button
              onClick={handleSetNickname}
              disabled={!nickname.trim() || !isConnected}
              style={{
                padding: '12px 24px',
                backgroundColor: nickname.trim() && isConnected ? '#0084ff' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: nickname.trim() && isConnected ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s',
              }}
            >
              {isConnected ? 'Войти в чат' : 'Подключение...'}
            </button>
          </div>
          <div style={{
            marginTop: '20px',
            fontSize: '12px',
            color: isConnected ? '#4caf50' : '#ff5722',
          }}>
            {isConnected ? '✓ Подключено к серверу' : '○ Подключение к серверу...'}
          </div>
        </div>
      </div>
    );
  }

  // Основной интерфейс чата
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#fff',
    }}>
      {/* Основная область чата */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Заголовок */}
        <div style={{
          padding: '15px 20px',
          backgroundColor: '#0084ff',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
            MIN Chat
          </h1>
          <div style={{ fontSize: '14px' }}>
            {currentUser && (
              <span>Привет, <strong>{currentUser.nick}</strong>!</span>
            )}
          </div>
        </div>

        {/* Список сообщений */}
        <MessageList messages={messages} currentUserId={currentUser?.id} />

        {/* Поле ввода */}
        <MessageInput
          onSendMessage={sendMessage}
          disabled={!isConnected}
        />
      </div>

      {/* Список пользователей */}
      <UserList users={users} currentUserId={currentUser?.id} />
    </div>
  );
};
