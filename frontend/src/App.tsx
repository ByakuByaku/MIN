import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import { LoginForm } from './components/LoginForm';
import { ChatWindow } from './components/ChatWindow';
import './App.css';

function App() {
  const { socket, isConnected, connect, disconnect } = useSocket();
  const [nickname, setNickname] = useState<string | null>(null);

  const handleLogin = (nick: string) => {
    setNickname(nick);
    connect(nick);
  };

  const handleLogout = () => {
    setNickname(null);
    disconnect();
  };

  return (
    <div className="app-container">
      {!nickname ? (
        <LoginForm onLogin={handleLogin} isConnected={false} />
      ) : (
        <ChatWindow 
          socket={socket} 
          isConnected={isConnected} 
          nickname={nickname}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
