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
    // Background color settings
let background = document.getElementById('backgroundColorPick');
let updateBackgroundColor = document.getElementById('updateBackgroundColor');

let colorBox = document.getElementById('color')
let notification = document.getElementById('notification');



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

usernameForm.addEventListener('click', event => {  
    event.preventDefault();
    let newUsername = usernameInput.value;
    chatroom.updateUsername(newUsername);  
    
    room();
    // When the username is updated a notification pops up briefly to inform the user
    notification.innerText = `Your username has been changed to ${newUsername}`;
    notification.classList.toggle('notificationBlock');
    colorBox.style.borderRadius = '0px 0px 0px 0px'
    
    setTimeout(()=>{
        notification.style.display = 'none';
        colorBox.style.borderRadius = '0px 0px 20px 20px'
    }, 3000)

    usernameInput.value = ''; 
})   

// Submit a new message, add it to the database and render it

messageForm.addEventListener('click', event => {
    event.preventDefault();
    console.log('aaa')
    let newMsg = messageInput.value;
    chatroom.addChat(newMsg)
                .then(() => messageForm.reset())
                .then(console.log(newMsg)) 
                .catch(error => console.log(error)) 
    messageInput.value = ''; 
    messageList.scrollTop = 9999999;
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

/*
let filter = document.getElementById('filterBtn');

filter.addEventListener('click', () => {
    let start = document.getElementById('start');
    let end = document.getElementById('end');   
    //let s = localStorage.setItem('start', start.value);
    //let e = localStorage.setItem('end', end.value);
    //chatroom.getFilteredChats(start.value, end.value, (data) => {
    //    ui.templateLi(data)
    //})
    console.log(start.value);
    console.log(end.value);
})
*/

updateBackgroundColor.addEventListener('click', () => {
    let back = document.getElementsByTagName("BODY")[0]
    back.style.backgroundColor = background.value;
})


messageList.addEventListener('click', (e) => {
    //e.preventDefault();
    if(e.target.parentElement.classList.contains('not-me')) {
        if(e.target.tagName === 'IMG') {
            e.target.parentElement.style.display = 'none'
        }  
    } else {
        if(e.target.tagName === 'IMG') { 
            let msg = e.target.nextSibling.nextSibling.nextSibling.nextSibling.innerText;
            console.log(msg); 
            chatroom.deleteChats(msg); 
            
            setTimeout(()=>{
                window.location.reload(true);
            }, 1000)
        }  
    }
    
})  