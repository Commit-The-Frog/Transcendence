const Modal = () =>{
    return `
    <div class="mymodal">
      <div class="mymodalOverlay">
        <div class="mymodalbox">
          <div class="closeWrapper">
            <button>
              X
            </button>
          </div>
          <div class="contentWrapper">
          </div>
          <div class="btnWrapper">
            <button>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
    `
}

export default Modal;