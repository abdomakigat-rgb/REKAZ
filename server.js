const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // للسماح بالاتصال من أي مكان أثناء التطوير
        methods: ["GET", "POST"]
    }
});

// تشغيل ملف الـ index.html تلقائياً عند فتح السيرفر
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// منطق الـ Socket.io للربط بين اللاعبين
io.on('connection', (socket) => {
    console.log('لاعب جديد اتصل: ' + socket.id);

    // عندما ينضم لاعب لغرفة معينة
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`اللاعب ${userId} انضم للغرفة: ${roomId}`);

        // إبلاغ اللاعبين الآخرين في الغرفة بوجود لاعب جديد
        socket.to(roomId).emit('user-connected', userId);

        // إرسال لغز جديد للكل في الغرفة
        socket.on('send-puzzle', (puzzleData) => {
            io.to(roomId).emit('new-puzzle', puzzleData);
        });

        // عند قطع الاتصال
        socket.on('disconnect', () => {
            console.log('لاعب قطع الاتصال: ' + userId);
            socket.to(roomId).emit('user-disconnected', userId);
        });
    });
});

// تشغيل السيرفر على بورت 3000 أو بورت الاستضافة
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`سيرفر اللعبة شغال على: http://localhost:${PORT}`);
});
