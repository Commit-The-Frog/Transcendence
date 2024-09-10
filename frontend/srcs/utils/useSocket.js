export default (() => {
    let instance = null; // 싱글톤 인스턴스를 위한 변수
    // 익명 함수로 한번만 실행되는 구조를 만들고 클로저로 instance를 유지
    return () => {
        if (instance) {
            return instance; // 이미 생성된 인스턴스를 반환
        }

        let currSocket = null; // 전역적으로 소켓을 관리할 변수
        console.log('useSocket initialized');

        const connectSocket = (url, { onopen, onerror, onclose, onmessage }) => {
            if (currSocket) {
                console.log('Closing previous socket connection', currSocket.url);
                currSocket.close();
            }

            try {
                const socket = new WebSocket(url);
                currSocket = socket;
                console.log('Connecting to WebSocket', currSocket.url);

                currSocket.onopen = () => {
                    if (onopen) onopen();
                    console.log('WebSocket connected');
                };

                currSocket.onerror = (error) => {
                    if (onerror) onerror(error);
                    console.error('WebSocket error', error);
                    currSocket.close();
                    currSocket = null;
                };

                currSocket.onclose = () => {
                    if (onclose) onclose();
                    console.log('WebSocket closed');
                    currSocket = null;
                };

                currSocket.onmessage = (event) => {
                    if (onmessage) onmessage(event);
                };
            } catch (error) {
                console.error('Failed to connect to WebSocket', error);
            }
        };

        const disconnectSocket = () => {
            if (currSocket) {
                console.log('Disconnecting WebSocket', currSocket.url);
                currSocket.close();
                currSocket = null;
            }
        };

        const getcurrentSocket = () => currSocket;

        // 인스턴스가 만들어지면 클로저에 저장
        instance = { connectSocket, disconnectSocket, getcurrentSocket };
        return instance; // 인스턴스를 반환
    };
})();

// export const { connectSocket, disconnectSocket, getcurrentSocket } = useSocket();