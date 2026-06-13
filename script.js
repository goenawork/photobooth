const video = document.getElementById("video");
const button = document.getElementById("startCamera");

button.addEventListener("click", async () => {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video:true
            });

        video.srcObject = stream;

    } catch(error) {

        alert("Kamera tidak dapat diakses");

        console.error(error);
    }

});
