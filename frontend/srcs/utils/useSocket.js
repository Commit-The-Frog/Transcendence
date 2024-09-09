import { useRef } from "../core/myreact/myreact"

const useSocekt = () => {
    const socketRef = useRef(null);

    const connectSocket = (url, {onOpen, onError, onClose, onMessage }) => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        const socket = new WebSocket(url);
        socket.onopen = () => {
            socketRef.current = socket;
            if (onOpen) {
                onOpen();
            }
            console.log('WebSocket 연결됨');
        }

        socket.onerror = () => {
            if (onError) {
                onError();
            }
            console.log('WebSocket 에러');
            socket.close();
        }
        socket.onclose = () => {
            if (onClose) {
                onClose();
            }
            console.log('WebSocket 닫았어');
            socketRef.current = null;
        }
        socket.onmessage = (event) => {
            if (onMessage) {
                onMessage(event);
            }
        }
    }

    const disconnectSocket = () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
    };
    return {connectSocket, disconnectSocket, socketRef}
}

export {connectSocket, disconnectSocket, socketRef, useSocekt};