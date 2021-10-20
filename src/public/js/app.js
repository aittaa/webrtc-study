
const socket = io();

// call

const call = document.getElementById("call");
call.hidden = true;
const myFace = document.getElementById("myFace");

let myStream;

let muted = false;
let cameraOff = false;

const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");

let roomName;

let myPeerConnection;

async function handleCameraChange() {
    await getMedia(cameraSelect.value);
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];

        const videoSender = myPeerConnection
            .getSenders()
            .find(sender => sender.track.kind === "video");
        
        console.log(videoSender);

        videoSender.replaceTrack(videoTrack);

    }
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
    
    
async function initCall() {
    
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    
    makeConnection();
    
}

// welcome form (join a room)

const welcome = document.getElementById("welcome");
let welcomeForm = welcome.querySelector("form");
    
async function handleWelcomeSubmit(event) {
    event.preventDefault();

    const input = welcomeForm.querySelector("input");

    await initCall();

    socket.emit("join_room", input.value);

    roomName = input.value;
    input.value = "";

}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

//Socket Code

socket.on("welcome", async () => {

    console.log("someone joined");
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    
    console.log("sent the offer");
    
    socket.emit("offer", offer, roomName); 

})

socket.on("offer", async (offer) => {

    console.log("received the offer");

    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);

    socket.emit("answer", answer, roomName);
    console.log("sent the answer");


});

socket.on("answer", answer => {
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
});

// RTC Code


function handleAddStream(data) {
    console.log("got as stream from my peer");
    console.log("Peer's Stream", data.stream);
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.stream;


}
function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });

    myPeerConnection.addEventListener("icecandidate", handleIce);

    myPeerConnection.addEventListener("addstream", handleAddStream);
  v
        .getTracks()
        .forEach(track => myPeerConnection.addTrack(track, myStream));

}

function handleIce(data) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
   
}
socket.on("ice", ice => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
});