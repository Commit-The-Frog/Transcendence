                  // 일반화된 이벤트 핸들러 함수 생성
export const createEventHandler = (className, callback) => {
    return function(event) {
      if (event.target.classList.contains(className)) {
        callback(event);
      } 
    };
  };
  
  const handlerMap = {};

  export const bindEventHandler = (eventType, className, callback, arg = '' , delay = 0) => {
    const handlerKey = `${eventType}_${className}_${arg}`;

    if (!handlerMap[handlerKey]) {
      const handler = createEventHandler(className, callback);
      
      handlerMap[handlerKey] = handler;
      
      setTimeout(() => {
        document.addEventListener(eventType, handler);
      }, delay);
    }
  };