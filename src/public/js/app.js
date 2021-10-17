
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");


// 이 소켓을 통해 서버와 메시지 송수신 가능
const socket = new WebSocket(`ws://${window.location.host}/`);

socket.addEventListener("open", () => {
    console.log("Connected to Server 👍");
});

socket.addEventListener("message", (message) => {
    // console.log("New Message: ", message.data);
    


});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server")
})


function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");

    //console.log(input.value);
    socket.send(input.value);
    input.value = "";

}

messageForm.addEventListener("submit", handleSubmit);