// Class import

import {Chatroom} from "./chat.js"
import {chatUi} from "./ui.js" 

// DOM elements

    // Message input 
let messageInput = document.getElementById('inputMessage');
let messageForm = document.getElementById('formNewMessage');
    // Username input
let usernameInput = document.getElementById('inputUsername');
let usernameForm = document.getElementById('formUpdateUsername');
    // List
let messageList = document.getElementById('ulMessages');
    // Chat room buttons
let navRooms = document.querySelectorAll('button');
let rooms = document.querySelector('nav');

let notification = document.getElementById('notification');

let settingsBtn = document.getElementById('settingsBtn');
let settings = document.querySelector('.settings');
let backDrop = document.querySelector('.backdropNone');
let closeBtn = document.getElementById('close');


// Checking for the username in the local storage

let checkUsername = () => {
    if(localStorage.usernameLS) {
        return localStorage.usernameLS;  
    } else {
        return 'Anonymus';
    }
}

// Adds a class to mark the selected button 

let selectedButton = b => {
    navRooms.forEach( btn => {
        btn.classList.remove("btn-selected");
    });
    b.classList.add("btn-selected");
}

let room = () => {
    let roomTmp = "general";    
    if(localStorage.room){
        roomTmp = localStorage.room;
    } 
    let btnTmp = document.querySelector(`#${roomTmp}`);  
    btnTmp.click();  
    selectedButton(btnTmp); 
    return roomTmp;
}
 
// Basic object creation

let chatroom = new Chatroom(room(), checkUsername());    
let ui = new chatUi(messageList); 

// Rendering messages when the room is loaded

chatroom.getChats(data => {
    ui.templateLi(data); 
});  

// Update username 

usernameForm.addEventListener('submit', event => { 
    event.preventDefault();
    let newUsername = usernameInput.value;
    chatroom.updateUsername(newUsername);  

    room();
    // When the username is updated a notification pops up briefly to inform the user
    notification.innerText = `Your username has been changed to ${newUsername}`;

    let clear = () => {
        notification.classList.toggle('notificationNone')
    }
    setTimeout(() => { 
        notification.classList.toggle('notificationBlock');
    }, 3000)  

})   

// Submit a new message, add it to the database and render it

messageForm.addEventListener('submit', event => {
    event.preventDefault();
    let newMsg = messageInput.value;
    chatroom.addChat(newMsg)
                .then(() => messageForm.reset())
                .then(console.log(newMsg)) 
                .catch(error => console.log(error)) 
});   
  
// Change the chat room
 
rooms.addEventListener('click', e => {
    if(e.target.tagName == "BUTTON"){
        //1. Izbrisati sve poruke sa ekrana kada menjamo sobu
        ui.clear();
        //2. Pozvati promenu sobe
        selectedButton(e.target); //Selektovanje aktivnog dugmeta (taba) u meniju
        let roomTmp = e.target.getAttribute("id");
        chatroom.updateRoom(roomTmp);
        localStorage.setItem('room',roomTmp);
        chatroom.getChats(data => {
            ui.templateLi(data); 
        });   
    }
}); 


let background = document.getElementById('backgroundColorPick');
let updateBackgroundColor = document.getElementById('updateBackgroundColor');
let filter = document.getElementById('filterBtn');
let start = document.getElementById('start');
let end = document.getElementById('end');

/*
filter.addEventListener('click', () => {
    let s = localStorage.setItem('start', start.value);
    let e = localStorage.setItem('end', end.value);
    chatroom.getFilteredChats(start, end, (data) => {
        ui.templateLi(data)
    })
    console.log(s);
    console.log(e);
})
*/

updateBackgroundColor.addEventListener('click', () => {
    let back = document.getElementsByTagName("BODY")[0]
    back.style.backgroundColor = background.value;
})
