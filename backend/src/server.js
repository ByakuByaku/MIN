import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
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
// ������� �������� ��������
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
io.on('connection', socket => {
    console.info('[socket] connected:', socket.id);
    socket.on('disconnect', () => {
        console.info('[socket] disconnected:', socket.id);
    });
});
httpServer.listen(PORT, () => {
    console.info(`[server] listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map