import { bindEventHandler } from "../utils/bindEventHandler.js";
import {useState} from "../core/myreact/myreact.js"

const Modal = ({ modal, closeHandler, onClose, children = null, data = null ,setData = null , childrenName = "" }) =>{
  if (!modal) {
    return `<div></div>`;
  }

  const eventPrevent = (e) => {
    e.stopPropagation();
  }
  bindEventHandler('click', "closeHandler" + childrenName, closeHandler);
  bindEventHandler('click', "eventPrevent", eventPrevent);
    return `
    <div class="mymodal">
      <div class="mymodalOverlay  ${"closeHandler" + childrenName}">
        <div class="mymodalbox eventPrevent">
          <div class="contentWrapper ">
            ${children ? children({onClose, data, setData}) : ''}
            </div>
        </div>
      </div>
    </div>
    `
}

export default Modal;