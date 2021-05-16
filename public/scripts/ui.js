export class chatUi {
    constructor(l) {
        this.list = l;
    }

    set list(l){
        this._list = l;
    }

    get list(){
        return this._list;
    }

    formatDate(date) {
        let d = date.getDate();
        let m = date.getMonth() +1;
        let y = date.getFullYear();
        let h = date.getHours();
        let min = date.getMinutes(); 

        // Adding zero's in front of single numbers

        m = String(m).padStart(2, '0');
        y = String(y).padStart(2, '0');
        h = String(h).padStart(2, '0');
        min = String(min).padStart(2, '0');

        // Here the date goes through a check, if the message was sent today it will display the hour:min format
        // If the message was sant from any other day it will display d:m:y - h:m format

        let strDate;
        let today = new Date();
        if(today.getDate() == d && today.getMonth() + 1 == m && y == today.getFullYear()) {
            strDate = `${h}:${min}`;
        } else {
            strDate = `${d}.${m}.${y}. - ${h}:${min}`;
        }
        return strDate;  
    }
    
    // This method renders the messages on the chat screen

    templateLi(data){
        let date = data.created_at.toDate();
        let strDate;
        strDate = this.formatDate(date);
        let htmlLi = `<li `;
            // The messages that are sent by the user will display right, others will display left
        if(data.username == localStorage.usernameLS) {
            htmlLi += `class='me liMsg'`;
        } else {
            htmlLi += `class="not-me liMsg">`;
        }
        htmlLi += 
        `        
            <span class="username">${data.username}:</span>
            <img src="./../icons/bin.png" >
            <br>
            <span class="message">${data.message}</span> 
            <div class="date">${strDate}</div>      
        </li>`
        this.list.innerHTML += htmlLi;
            // Automaticly scrolls to the last sent message
        this.list.scrollTop = this.list.scrollHeight; 
    }

    clear(){
        this.list.innerHTML = '';
    }
    
} 

