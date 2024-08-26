import { bindEventHandler } from "../utils/bindEventHandler.js";

const UserEdit = () => {
    // submit btn을 눌렀을때 사진이 있으면 사진 보내고,
    // 없으면... 기본 사진 넣어주고..
    const profileImgInputHandler = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imagePreview = document.getElementById("imagePreview");
                imagePreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        } else {
            // 에러처리
        }
    }
    bindEventHandler('change', "profileImgInputHandler", profileImgInputHandler);
    return `
    <div class="useredit">
        <div class="profileimgInputWrapper">
            <div class="profilePreviewContainer">
                <img class="prfilePreviewImg" id="imagePreview" src="/default.png" alt="Image Preview"  />
            </div>
            <label for="profileimg-input" class="profileimgInputLabel"> 업로드 </label>
            <input type="file" id="profileimg-input" accept=".jpg, .jpeg, .png" class="profileimgInput profileImgInputHandler"/>
        </div>
    </div>
    `
};

export default UserEdit;