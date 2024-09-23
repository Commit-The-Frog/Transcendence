
const refresh = async () => {
    const url = `https://${window.env.SERVER_IP}/login/refresh`;
    return myAxios.get(url)
    .then(()=>{
        return true;
    })
    .catch((err)=>{
        if (err.status === 401) {
            return false;
        }
        return true;
    })
}

const islogin = async () => {
    const url = `https://${window.env.SERVER_IP}/login/islogin`;
    try {
        await myAxios.get(url);
        return true;
    } catch (err) {
        if (err.status === 401) {
            const refreshed = await refresh();
            return refreshed;
        }
        return false;
    }
}


const connectStatusSocket = async (route) => {
    if (route != "/twofa" && route != "/") {
        // const isLoggedIn = await islogin(); // islogin을 기다림
        // if (!isLoggedIn) {
        //     changeUrl("/");
        //     return;
        // }

        // 로그인 체크 후 소켓 연결 시도
        if (getSocket() === null) {
            const url = `wss://${window.location.host}/ws/user/status`;
            connectAccessSocket(url);
        }
    }
};