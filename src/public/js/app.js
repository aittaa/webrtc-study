
const socket = io();

const myFace = document.getElementById("myFace");

let myStream;

let muted = false;
let cameraOff = false;

const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");



async function handleCameraChange() {
    await getMedia(cameraSelect.value);
}

cameraSelect.addEventListener("input", handleCameraChange);


function handleMuteClick() {

    myStream
        .getAudioTracks()
        .forEach(track => track.enabled = !track.enabled);
    
    if (muted) {
        muted = false;
        muteBtn.innerText = "Mute";
        
    } else {
        muted = true;
        muteBtn.innerText = "Unmute";
        
    }
}

function handleCameraClick() {

    myStream
        .getVideoTracks()
        .forEach(track => track.enabled = !track.enabled);


    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;

    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }

}


muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);


async function getCameras() {

    try {

        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");

        const currentCamera = myStream.getVideoTracks()[0].label;

        cameras.forEach(camera => {

            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;

            if (currentCamera === camera.label) {
                option.selected = true;
            }
            
            cameraSelect.appendChild(option);
        })

     } catch (e) {
        console.log(e);
    }

}

async function getMedia(deviceId) {
    
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: {exact : deviceId}}
    }

    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            (deviceId) ? cameraConstraints : initialConstrains
        );
        myFace.srcObject = myStream;
        if (!deviceId) { await getCameras();}
    
    }
    catch (e) {
        console.log(e);
    }
    
}

getMedia();


