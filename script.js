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

    capturedPhotos = [];

    for(let pose=1;pose<=4;pose++){

        statusText.textContent =
            `Pose ${pose} dari 4`;

        for(let i=3;i>=1;i--){

            countdown.textContent = i;

            await new Promise(resolve =>
                setTimeout(resolve,1000)
            );

        }

        countdown.textContent = "📸";

        await new Promise(resolve =>
            setTimeout(resolve,500)
        );

        capturedPhotos.push(
            takePhoto()
        );

        countdown.textContent = "";

        await new Promise(resolve =>
            setTimeout(resolve,1000)
        );

    }

    statusText.textContent =
        "Selesai";

    createStrip();

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

    return canvas.toDataURL("image/png");
}
async function createStrip(){

    const stripCanvas =
        document.createElement("canvas");

    const stripCtx =
        stripCanvas.getContext("2d");

    const width = 640;
    const height = 480;

    stripCanvas.width = width;
    stripCanvas.height = height * 4;

    for(let i=0;i<capturedPhotos.length;i++){

        const img = new Image();

        await new Promise(resolve => {

            img.onload = () => {

                stripCtx.drawImage(
                    img,
                    0,
                    i * height,
                    width,
                    height
                );

                resolve();

            };

            img.src = capturedPhotos[i];

        });

    }

finalStripImage =
    stripCanvas.toDataURL("image/png");

photo.src = finalStripImage;

downloadBtn.style.display = "inline-block";
}
startSession.addEventListener(
    "click",
    runCountdown
);
const statusText =
    document.getElementById("status");

let capturedPhotos = [];

const downloadBtn =
    document.getElementById("downloadBtn");

let finalStripImage = "";

function downloadStrip(){

    const link =
        document.createElement("a");

    link.href = finalStripImage;

    link.download =
        `photobooth-${Date.now()}.png`;

    link.click();

}
downloadBtn.addEventListener(
    "click",
    downloadStrip
);
