const socket = io("http://localhost:8000");

//Get DOM elements in respective JS variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio = new Audio("Iphone Ting Message Tone.mp3");

//Function which will append the event information to the container
const append = (message,position) => {
     const messageElement = document.createElement("div");
     messageElement.innerText = message;
     messageElement.classList.add("message");
     messageElement.classList.add(position);
     messageContainer.append(messageElement);
     
     if(position == "left"){
        audio.play();
     };
};

//TURN ON THE CORS GOOGLE EXTENSION

//Asking the new user for his/her name and let the server know
const name1 = prompt("Enter your name to join");
socket.emit("new-user-joined" , name1);

//If a new user joins, receive his/her name from the server
socket.on("user-joined" , name => {
    append(`${name} joined the chat!` , "right");
});

// if server sends a message, receive it
socket.on("receive" , data => {
    append(`${data.name}: ${data.message}` , "left");
});

//if a user leaves the chat, append the info in the container
socket.on("left" , name => {
    append(`${name} left the chat!` , "right");
});

//if the form gets submitted, send the message to the server
form.addEventListener("submit" , (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}` , "right");
    socket.emit("send" , message);
    messageInput.value = '';
});