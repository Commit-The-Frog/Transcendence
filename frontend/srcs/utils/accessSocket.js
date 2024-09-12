const accessSocket = () => {
    let socket = null;
    const connectAccessSocket = (url) => {
        if (socket) {
            return ;
        }
        socket = new WebSocket(url);
        socket.onopen = () => {
            console.log('user access socket open');
        }
        socket.onerror = (error) => {
            console.log('user access socket error', error);
        }
        socket.onclose = () => {
            console.log('user access socket close');
        }
        socket.onmessage = (event) => {
            console.log('user access socket message', event.data);
        }

    }
    const getSocket = () => {
        return null;
    }
    return {connectAccessSocket, getSocket};       
}

export const {connectAccessSocket, getSocket} = accessSocket();