import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { User, Message } from './types';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Хранилище данных
const users = new Map<string, User>();
const messages: Message[] = [];

// Проверка здоровья сервера
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.on('connection', socket => {
  console.info('[socket] connected:', socket.id);

  // Создаем пользователя с дефолтным ником
  const user: User = {
    id: socket.id,
    nick: `User${socket.id.substring(0, 4)}`,
  };
  users.set(socket.id, user);

  // Отправляем текущему пользователю его данные
  socket.emit('user:current', user);

  // Отправляем список пользователей
  socket.emit('users:list', Array.from(users.values()));

  // Отправляем историю сообщений
  socket.emit('messages:history', messages);

  // Уведомляем всех о новом пользователе
  socket.broadcast.emit('user:joined', user);

  // Установка никнейма
  socket.on('user:set-nick', (data: { nick: string }) => {
    const user = users.get(socket.id);
    if (user && data.nick.trim()) {
      user.nick = data.nick.trim();
      users.set(socket.id, user);
      
      // Обновляем информацию о текущем пользователе
      socket.emit('user:current', user);
      
      // Обновляем список пользователей для всех
      io.emit('users:list', Array.from(users.values()));
      
      console.info('[socket] user set nick:', socket.id, '->', user.nick);
    }
  });

  // Отправка сообщения
  socket.on('message:send', (data: { text: string }) => {
    const user = users.get(socket.id);
    if (user && data.text.trim()) {
      const message: Message = {
        id: `${Date.now()}-${socket.id}`,
        text: data.text.trim(),
        userId: user.id,
        userName: user.nick,
        timestamp: new Date().toISOString(),
      };
      
      messages.push(message);
      
      // Отправляем сообщение всем подключенным клиентам
      io.emit('message:new', message);
      
      console.info('[socket] message from', user.nick, ':', data.text);
    }
  });

  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      
      // Уведомляем всех об отключении пользователя
      socket.broadcast.emit('user:left', socket.id);
      
      console.info('[socket] disconnected:', socket.id, '(', user.nick, ')');
    }
  });
});

httpServer.listen(PORT, () => {
  console.info(`[server] listening on http://localhost:${PORT}`);
});
