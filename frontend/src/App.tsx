import { useSocket } from './hooks/useSocket';

function App() {
  const { socket, isConnected } = useSocket();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>MIN - WebSocket Chat</h1>
      <div style={{ marginBottom: '20px' }}>
        <strong>Статус подключения:</strong>{' '}
        <span style={{ color: isConnected ? 'green' : 'red' }}>
          {isConnected ? 'Подключено' : 'Отключено'}
        </span>
      </div>
      {socket && (
        <div>
          <strong>Socket ID:</strong> {socket.id || 'N/A'}
        </div>
      )}
      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>Frontend готов к работе!</p>
        <p>Socket.io клиент подключен и готов к обмену сообщениями.</p>
      </div>
    </div>
  );
}

export default App;
