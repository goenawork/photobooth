// =====================
// ELEMENT HTML
// =====================

const video =
    document.getElementById("video");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const startSession =
    document.getElementById("startSession");

const countdown =
    document.getElementById("countdown");

const statusText =
    document.getElementById("status");

const photo =
    document.getElementById("photo");

const downloadBtn =
    document.getElementById("downloadBtn");

const templateSelect =
    document.getElementById("templateSelect");

// =====================
// DATA
// =====================

let capturedPhotos = [];

let finalStripImage = "";

// =====================
// TEMPLATE CONFIG
// =====================

const templates = {

    "MSC-001": {

        file:
            "assets/templates/MSC-001.png",

        slots: [

            { x: 80, y: 190, w: 1040, h: 280 },

            { x: 80, y: 510, w: 1040, h: 280 },

            { x: 80, y: 830, w: 1040, h: 280 },

            { x: 80, y: 1150, w: 1040, h: 280 }

        ]

    },

    "MSC-002": {

        file:
            "assets/templates/MSC-002.png",

        slots: [

            { x: 80, y: 190, w: 1040, h: 280 },

            { x: 80, y: 510, w: 1040, h: 280 },

            { x: 80, y: 830, w: 1040, h: 280 },

            { x: 80, y: 1150, w: 1040, h: 280 }

        ]

    },

    "MSC-003": {

        file:
            "assets/templates/MSC-003.png",

        slots: [

    { x: 170, y: 245, w: 390, h: 540 },

    { x: 640, y: 245, w: 390, h: 540 },

    { x: 170, y: 860, w: 390, h: 540 },

    { x: 640, y: 860, w: 390, h: 540 }

]

    }

};

// =====================
// CAMERA
// =====================

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        video.srcObject = stream;

    } catch (error) {

        console.error(error);

        alert(
            "Tidak dapat mengakses kamera"
        );

    }

}

// =====================
// TAKE PHOTO
// =====================

function takePhoto() {

    ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return canvas.toDataURL(
        "image/png"
    );

}

// =====================
// DRAW COVER
// =====================

function drawCover(
    ctx,
    img,
    x,
    y,
    w,
    h
) {

    const imageRatio =
        img.width / img.height;

    const frameRatio =
        w / h;

    let sx;
    let sy;
    let sWidth;
    let sHeight;

    if (imageRatio > frameRatio) {

        sHeight = img.height;

        sWidth =
            sHeight * frameRatio;

        sx =
            (img.width - sWidth) / 2;

        sy = 0;

    } else {

        sWidth = img.width;

        sHeight =
            sWidth / frameRatio;

        sx = 0;

        sy =
            (img.height - sHeight) / 2;

    }

    ctx.drawImage(
        img,
        sx,
        sy,
        sWidth,
        sHeight,
        x,
        y,
        w,
        h
    );

}

// =====================
// CREATE TEMPLATE
// =====================

async function createTemplate() {

    const selected =
        templateSelect.value;

    const template =
        templates[selected];

    const finalCanvas =
        document.createElement(
            "canvas"
        );

    const finalCtx =
        finalCanvas.getContext("2d");

    finalCanvas.width = 1200;
    finalCanvas.height = 1800;

    finalCtx.fillStyle =
        "#ffffff";

    finalCtx.fillRect(
        0,
        0,
        1200,
        1800
    );

    // FOTO

    for (
        let i = 0;
        i < capturedPhotos.length;
        i++
    ) {

        const img =
            new Image();

        await new Promise(
            resolve => {

                img.onload = () => {

                    drawCover(
                        finalCtx,
                        img,
                        template.slots[i].x,
                        template.slots[i].y,
                        template.slots[i].w,
                        template.slots[i].h
                    );

                    resolve();

                };

                img.src =
                    capturedPhotos[i];

            }
        );

    }

    // TEMPLATE PNG

    const frame =
        new Image();

    await new Promise(
        resolve => {

            frame.onload = () => {

                finalCtx.drawImage(
                    frame,
                    0,
                    0,
                    1200,
                    1800
                );

                resolve();

            };

            frame.onerror = () => {

                console.error(
                    "Template gagal dimuat"
                );

                resolve();

            };

            frame.src =
                template.file;

        }
    );

    finalStripImage =
        finalCanvas.toDataURL(
            "image/png"
        );

    photo.src =
        finalStripImage;

    downloadBtn.style.display =
        "inline-block";

}

// =====================
// PHOTO SESSION
// =====================

async function runCountdown() {

    startSession.disabled =
        true;

    downloadBtn.style.display =
        "none";

    capturedPhotos = [];

    for (
        let pose = 1;
        pose <= 4;
        pose++
    ) {

        statusText.textContent =
            `Pose ${pose} dari 4`;

        for (
            let i = 3;
            i >= 1;
            i--
        ) {

            countdown.textContent =
                i;

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        1000
                    )
            );

        }

        countdown.textContent =
            "📸";

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    500
                )
        );

        capturedPhotos.push(
            takePhoto()
        );

        countdown.textContent =
            "";

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    1000
                )
        );

    }

    statusText.textContent =
        "Menyusun hasil...";

    await createTemplate();

    statusText.textContent =
        "Selesai";

    startSession.disabled =
        false;

}

// =====================
// DOWNLOAD
// =====================

function downloadStrip() {

    const link =
        document.createElement(
            "a"
        );

    link.href =
        finalStripImage;

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
