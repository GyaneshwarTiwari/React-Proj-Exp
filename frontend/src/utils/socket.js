import { io } from 'socket.io-client';

let socket = null;

export function getSocket(token) {
    if (socket && socket.connected) return socket;
    try {
        const opts = {
            auth: { token },
            transports: ['websocket']
        };

        let baseUrl = process.env.REACT_APP_API_WS_URL;
        if (!baseUrl) {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
            try {
                // Use URL to extract origin (scheme + host + port)
                baseUrl = new URL(apiUrl).origin;
            } catch (err) {
                // Fallback: strip common /api/v1 suffix
                baseUrl = apiUrl.replace(/\/api\/v1\/?$/, '');
            }
        }

        console.debug('[socket] connecting to', baseUrl);
        socket = io(baseUrl, opts);

        socket.on('connect', () => {
            console.debug('[socket] connected', socket.id);
        });
        socket.on('disconnect', (reason) => {
            console.debug('[socket] disconnected', reason);
        });
        socket.on('connect_error', (err) => {
            console.warn('[socket] connect_error', err?.message || err);
        });
    } catch (err) {
        console.error('Failed to initialize socket', err);
        socket = null;
    }
    return socket;
}

export function disconnectSocket() {
    try {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    } catch (err) {
        console.warn('Error disconnecting socket', err);
    }
}
