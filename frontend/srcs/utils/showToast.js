import { useRecoilState } from "../core/myrecoil/myrecoil.js"
import { toastState } from "../recoil/toastState.js";

const showToastHandler = (message) => {
    const [, setShowToast] = useRecoilState(toastState, 'toastState');
    setShowToast({
        show: true,
        msg : message,
    });
    setTimeout(()=>{
        setShowToast({
            show: false,
            msg : '',
        })
    },1000);
}

export {showToastHandler};