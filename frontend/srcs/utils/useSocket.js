export default (() => {
    let instance = null; 
    console.log('usesocket');
    
    const init = () => {
        let currSocket = null;
        console.log('useSocket initialized');

        const connectSocket = (url, { onopen, onerror, onclose, onmessage }) => {
            if (currSocket) {
                currSocket.close();
                currSocket = null;
            }
            const socket = new WebSocket(url);
            currSocket = socket;

                currSocket.onopen = () => {
                    if (onopen) onopen();
                };

                currSocket.onerror = (error) => {
                    if (onerror) onerror(error);
                };

                currSocket.onclose = () => {
                    if (onclose) onclose();
                };

                currSocket.onmessage = (event) => {
                    if (onmessage) onmessage(event);
                };
        };

        const disconnectSocket = () => {
            if (currSocket) {
                currSocket.close();
                currSocket = null;
            }
        };

        const getcurrentSocket = () => {

            return currSocket
        };

        // 인스턴스가 만들어지면 클로저에 저장
        instance = { connectSocket, disconnectSocket, getcurrentSocket };
        return instance; // 인스턴스를 반환
    }
    return () => {
        if (!instance) {
            instance = init(); // 이미 생성된 인스턴스를 반환
        }
        return instance;

       // 전역적으로 소켓을 관리할 변수

    };
})();

// export const { connectSocket, disconnectSocket, getcurrentSocket } = useSocket();