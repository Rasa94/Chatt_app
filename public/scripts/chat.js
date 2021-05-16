export class Chatroom {
    constructor(r, u){
        this.room = r;
        this.username = u;
        this.chats = db.collection('chats');
        this.id;
        this.unsub;
        this.del;
    }
    set room(r){
        this._room = r;
    }
    set username(u){
        this._username = u;
    }
    get room(){
        return this._room;
    }
    get username(){
        return this._username;
    }

    // Universally unique identifier (UUID)

    uuid() {
        let random = Math.random().toString(16) + Math.random().toString(16);
        return random;
    }

    async addChat(msg) { 

        // Get the date for the timestamp

        let date = new Date();

        // This was a experiment with a custom UUID
        // The goal is to assign it as the id for the firebase document         

        let randomUuid = this.uuid(); 

        // Creating the object/document which we add to the database

        let chatDoc = {
            message: msg,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(date),
            id: randomUuid
        }

        let response = await this.chats.doc(randomUuid).set(chatDoc);    
        return response;

    }

    getChats(callback) {
        this.unsub = this.chats
                    .where('room', '==', this.room) 
                    .orderBy('created_at')
                    .onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(change => {
                            // If the message is added to the database do a update
                            if(change.type === 'added'){
                                callback(change.doc.data());
                            } 
                        });
                    });
    }

    deleteChats(msg) {
        this.chats.onSnapshot(el => {
            el.forEach(doc => {
                if(doc.data().message == msg) {
                    this.chats
                        .doc(doc.id)
                        .delete()
                        .then(()=> {
                            window.location.reload(true)
                        })
                }
            })
        })
    }

    getFilteredChats(callback) {
        this.unsub = this.chats
                    .where('created_at', '>', start)
                    .where('created_at', '<', end)
                    .orderBy('created_at')
                    .onSnapshot(snapshot => {
                        snapshot.docChanges().forEach(change => {
                            if(change.type === 'added'){
                                callback(change.doc.data());
                            } 
                        });
                    });
    }

        // This method updates the room in the local storage, not in the database

    updateUsername(newUsername) {
        this.username = newUsername;
        localStorage.setItem('usernameLS', newUsername);
        console.log(newUsername); 
    }

    updateRoom(newRoom) {
        this.room = newRoom;
        if(this.unsub){
            this.unsub();
        }
        console.log(newRoom);  
    }
}