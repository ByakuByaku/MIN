import express, { Request, Response } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { User, Message } from './types';

const PORT = process.env.PORT || 3001;

const users: User[] = [];
const messages: Message[] = [];
const MAX_HISTORY = 50;

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

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

io.on('connection', (socket: Socket) => {
  console.info('[socket] connected:', socket.id);

  socket.on('user:join', (nick: string) => {
    const existing = users.find(u => u.id === socket.id);
    if (!existing) {
      const user: User = { id: socket.id, nick };
      users.push(user);
      console.info('[user:join]', user);

      const history = messages.slice(-MAX_HISTORY);
      socket.emit('chat:history', history);

      io.emit('user:list', users);
      io.emit('user:joined', user);
    }
  });

  socket.on('chat:message', (text: string) => {
    const user = users.find(u => u.id === socket.id);
    if (!user) {
      console.warn('[chat:message] unknown user', socket.id);
      return;
    }

    const message: Message = {
      id: `${socket.id}-${Date.now()}`,
      text,
      userId: user.id,
      userName: user.nick,
      timestamp: new Date().toISOString()
    };

    messages.push(message);
    if (messages.length > MAX_HISTORY) {
      messages.splice(0, messages.length - MAX_HISTORY);
    }

    console.info('[chat:message]', message);

    io.emit('chat:message', message);
  });

  socket.on('disconnect', () => {
    const index = users.findIndex(u => u.id === socket.id);
    if (index !== -1) {
      const [removed] = users.splice(index, 1);
      console.info('[socket] disconnected:', removed);
      io.emit('user:left', removed);
      io.emit('user:list', users);
    } else {
      console.info('[socket] disconnected (no user):', socket.id);
    }
  });
});

httpServer.listen(PORT, () => {
  console.info(`[server] listening on http://localhost:${PORT}`);
});
