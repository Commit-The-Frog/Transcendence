import { _render, render } from "./core/myreact/myreact.js";
import { App } from "./App.js";

const $app = document.querySelector(".App");

render($app, App);
window.addEventListener('popstate', _render);
window.addEventListener('DOMContentLoaded', _render);  