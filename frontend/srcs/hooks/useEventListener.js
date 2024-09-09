import { useEffect } from "../core/myreact/myreact";

export default useEventListener = (eventType, handler, element = document, delay = 0) => {
    useEffect(()=>{
        if (!element || !handler) return ;

        const eventHandler = (event) => {
            setTimeout(()=>{
                handler(event);
            },delay);
        };

        element.addEventListener(eventType, eventHandler);
        return () => {
            element.removeEventListener(eventType, eventHandler);
        };
    },[eventType, handler, element, delay])
}