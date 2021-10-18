
const socket = io();

const myFace = document.getElementById("myFace");

let myStream;

let muted = false;
let cameraOff = false;

const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");




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
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            cameraSelect.appendChild(option);
        })

     } catch (e) {
        console.log(e);
    }

}

async function getMedia() {

    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            //무엇을 얻고 싶은가?
            audio: true,
            video: true,
        });
        myFace.srcObject = myStream;
        await getCameras();
    }
    catch (e) {
        console.log(e);
    }
    
}

getMedia();