// 일반화된 이벤트 핸들러 함수 생성
export const createEventHandler = (className, callback) => {
    return function(event) {
      if (event.target.classList.contains(className)) {
        callback(event);
      }
    };
  };
  
  // 이벤트 핸들러를 바인딩하는 일반화된 함수
 export const bindEventHandler = (eventType, className, callback, delay = 0) => {
    const handler = createEventHandler(className, callback);
    setTimeout(() => {
      document.addEventListener(eventType, handler);
    }, delay);
  };