import { _render, render } from "./core/myreact/myreact.js";
import { App } from "./App.js";

const $app = document.querySelector(".App");

var currSocket = null;

render($app, App);
window.addEventListener('popstate', _render);
window.addEventListener('DOMContentLoaded', _render);
window.addEventListener('load', () => {
    // 현재 URL의 pathname 확인
    const currentUrl = window.location.pathname;
    
    // 쿼리 파라미터가 있는지 확인
    const hasQuery = window.location.search.length > 0;
    
    // URL의 끝에 '/'가 있는지 확인하고, '/'가 있으면 제거
    if (currentUrl.length > 1 && currentUrl.endsWith('/')) {
        const newUrl = currentUrl.slice(0, -1) + window.location.search; // 슬래시 제거 후 쿼리 스트링 유지

        // URL을 수정 (replaceState로 브라우저 히스토리 변경)
        window.history.replaceState(null, '', newUrl);
    }
});