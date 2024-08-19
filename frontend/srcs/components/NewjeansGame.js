import { useEffect } from "../core/myreact/myreact.js";

const NewjeansGame = () => {
    // useEffect(()=>{
    //     const canvas = document.querySelector('.newjeansCanvas');
    //     const ctx = canvas?.getContext('2d');

    //     if (canvas) {
    //         canvas.width = 800;
    //         canvas.height = 600;

    //         // ctx.fillStyle = '#f0f0f0';  // 원하는 색상으로 설정
    //         // ctx.fillRect(0, 0, canvas.width, canvas.height);
    //         const backgroundImage = new Image();
    //         backgroundImage.src = '../NewJeans.jpg'; // 이미지 파일 경로를 지정

        
    //         backgroundImage.onload = function() {
    //             // 이미지 로드가 완료되면 캔버스에 그리기
    //             ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        
    //             // 예시로, 이미지 위에 텍스트 추가
    //             ctx.fillStyle = 'white';
    //             ctx.font = '30px Arial';
    //             ctx.fillText('Hello, Canvas!', 50, 50);
    //         };
    //     }
    // },[], 'newjeanscanvas');
    return `
    <div class="newjeansGameWrapper">
        <canvas class="newjeansCanvas">
        </canvas>
    </div>
    `
}

export default NewjeansGame;