
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");


// 이 소켓을 통해 서버와 메시지 송수신 가능
const socket = new WebSocket(`ws://${window.location.host}/`);

function makeMessage(type, payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}


socket.addEventListener("open", () => {
    console.log("Connected to Server 👍");
});

socket.addEventListener("message", (message) => {
    //console.log("New Message: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;

    messageList.append(li);


});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server")
})


function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("message", input.value));

    // 내가 보낸 메시지
    const li = document.createElement("li");
    li.innerText = `You : ${input.value}`;
    messageList.append(li);

    input.value = "";


}

messageForm.addEventListener("submit", handleSubmit);


function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}


nickForm.addEventListener("submit", handleNickSubmit);