// =====================
// ELEMENT HTML
// =====================

const video = document.getElementById("video");
const startSession = document.getElementById("startSession");

const countdown = document.getElementById("countdown");
const statusText = document.getElementById("status");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const photo = document.getElementById("photo");

const downloadBtn = document.getElementById("downloadBtn");

const templateSelect = document.getElementById("templateSelect");

// =====================
// DATA
// =====================

let capturedPhotos = [];
let finalStripImage = "";

// =====================
// CAMERA
// =====================

async function startCamera() {
    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

    } catch (error) {

        console.error(error);
        alert("Tidak dapat mengakses kamera");

    }
}

// =====================
// PHOTO SESSION
// =====================

async function runCountdown() {

    startSession.disabled = true;
    downloadBtn.style.display = "none";

    capturedPhotos = [];

    for (let pose = 1; pose <= 4; pose++) {

        statusText.textContent = `Pose ${pose} dari 4`;

        for (let i = 3; i >= 1; i--) {

            countdown.textContent = i;

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

        }

        countdown.textContent = "📸";

        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );

        capturedPhotos.push(
            takePhoto()
        );

        countdown.textContent = "";

        await new Promise(resolve =>
            setTimeout(resolve, 1000)
        );

    }

    statusText.textContent = "Menyusun hasil foto...";

    await createStrip();

    statusText.textContent = "Selesai";

    startSession.disabled = false;

}

// =====================
// CAPTURE PHOTO
// =====================

function takePhoto() {

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas.toDataURL("image/png");

}

// =====================
// CREATE PHOTO STRIP
// =====================

async function createStrip() {

    const stripCanvas =
        document.createElement("canvas");

    const stripCtx =
        stripCanvas.getContext("2d");

    const width = 640;
    const height = 480;

    stripCanvas.width = width;
    stripCanvas.height = height * 4;

    for (let i = 0; i < capturedPhotos.length; i++) {

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

// =====================
// DOWNLOAD
// =====================

function downloadStrip() {

    const link =
        document.createElement("a");

    link.href = finalStripImage;

    link.download =
        `photobooth-${Date.now()}.png`;

    link.click();

}

// =====================
// EVENTS
// =====================

startSession.addEventListener(
    "click",
    runCountdown
);

downloadBtn.addEventListener(
    "click",
    downloadStrip
);

// =====================
// START APP
// =====================

startCamera();
