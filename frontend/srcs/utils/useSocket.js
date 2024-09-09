import { useRef } from "../core/myreact/myreact.js"

const useSocekt = () => {
    const socketRef = useRef(null);

    const connectSocket = (url, {onopen, onerror, onclose, onmessage }) => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        const socket = new WebSocket(url);
        socketRef.current = socket;
        socket.onopen = () => {
            if (onopen) {
                onopen();
            }
            console.log('WebSocket 연결됨');
        }

        socket.onerror = () => {
            if (onerror) {
                onerror();
            }
            console.log('WebSocket 에러');
            socket.close();
            socketRef.current = null;
        }
        socket.onclose = () => {
            if (onclose) {
                onclose();
            }
            console.log('WebSocket 닫았어');
            socketRef.current = null;
        }
        socket.onmessage = (event) => {
            if (onmessage) {
                onmessage(event);
            }
        }
    }

    const disconnectSocket = () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
    };

    const getcurrentSocket = () => {
        return socketRef.current;
    }
    return {connectSocket, disconnectSocket, getcurrentSocket}
}

export const {connectSocket, disconnectSocket,getcurrentSocket} = useSocekt();