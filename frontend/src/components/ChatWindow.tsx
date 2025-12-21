import { useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserList } from './UserList';
import { useChat } from '../hooks/useChat';
import { Socket } from 'socket.io-client';

interface ChatWindowProps {
  socket: Socket | null;
  isConnected: boolean;
  nickname: string;
  onLogout: () => void;
}

export const ChatWindow = ({ socket, isConnected, nickname, onLogout }: ChatWindowProps) => {
  const { messages, users, currentUser, sendMessage, setNickname } = useChat({
    socket,
    isConnected,
  });
  
  const nicknameSetRef = useRef(false);

  // Устанавливаем никнейм один раз при подключении
  useEffect(() => {
    if (isConnected && socket && nickname && !nicknameSetRef.current) {
      console.log('[ChatWindow] Setting nickname:', nickname);
      setNickname(nickname);
      nicknameSetRef.current = true;
    }
  }, [isConnected, socket, nickname, setNickname]);

  return (
    <div className="chat-container">
      <div className="chat-main">
        <div className="chat-header">
          <h1>MIN Chat</h1>
          <div className="chat-header-user">
            {currentUser && (
              <>
                <span>Привет, <strong>{currentUser.nick}</strong>!</span>
                <button 
                  className="btn-change-nick" 
                  onClick={onLogout}
                  title="Сменить никнейм"
                >
                  ⚙️
                </button>
              </>
            )}
          </div>
        </div>

        <MessageList messages={messages} currentUserId={currentUser?.id} />
        
        <MessageInput
          onSendMessage={sendMessage}
          disabled={!isConnected}
        />
      </div>

      <UserList users={users} currentUserId={currentUser?.id} />
    </div>
  );
};
