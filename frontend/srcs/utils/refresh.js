import myAxios from "../core/myaxios/myAxios.js";

const refresh = async () => {
    const url = `https://${window.env.SERVER_IP}/login/refresh`;
    console.log('refresh');
    return myAxios.get(url, {skipAuthRefresh : true})
    .then(()=>{
        return true;
    })
    .catch((err)=>{
        if (err.status === 401) {
            return false;
        }
        return false;
    })
}

export default refresh;