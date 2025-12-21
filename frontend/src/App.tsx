import { useSocket } from './hooks/useSocket';
import { ChatWindow } from './components/ChatWindow';

function App() {
  const { socket, isConnected } = useSocket();

  return <ChatWindow socket={socket} isConnected={isConnected} />;
}

export default App;
