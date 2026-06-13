const video = document.getElementById("video");
const startSession = document.getElementById("startSession");

const countdown = document.getElementById("countdown");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const photo = document.getElementById("photo");

async function startCamera(){

    try{

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video:true
            });

        video.srcObject = stream;

    }catch(error){

        alert("Tidak dapat mengakses kamera");

    }

}

startCamera();

async function runCountdown(){

    startSession.disabled = true;

    for(let i=3;i>=1;i--){

        countdown.textContent = i;

        await new Promise(resolve =>
            setTimeout(resolve,1000)
        );

    }

    countdown.textContent = "";

    takePhoto();

    startSession.disabled = false;
}

function takePhoto(){

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image =
        canvas.toDataURL("image/png");

    photo.src = image;

}

startSession.addEventListener(
    "click",
    runCountdown
);
const statusText =
    document.getElementById("status");

let capturedPhotos = [];
