import { bindEventHandler } from "../utils/bindEventHandler.js";

const Modal = ({ modal, closeHandler, onClose, children = null }) =>{

  if (!modal) {
    return `<div></div>`;
  }

  const eventPrevent = (e) => {
    e.stopPropagation();
  }
  bindEventHandler('click', "closeHandler", closeHandler);
  bindEventHandler('click', "eventPrevent", eventPrevent);
    return `
    <div class="mymodal">
      <div class="mymodalOverlay closeHandler">
        <div class="mymodalbox eventPrevent">
          <div class="contentWrapper ">
            ${children ? children({onClose}) : ''}
            </div>
        </div>
      </div>
    </div>
    `
}

export default Modal;