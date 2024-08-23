import { bindEventHandler } from "../utils/bindEventHandler.js";

const Modal = ({ modal, closeHandler, className, children = null }) =>{

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
          <div class="closeWrapper closeHandler">
            <button class="closeHandler">
              X
            </button>
          </div>
          <div class="contentWrapper ">
            ${children ? children() : ''}
            </div>
        </div>
      </div>
    </div>
    `
}

export default Modal;