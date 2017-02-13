import * as firebase from 'firebase/firebase-browser';


class ChatApi {

  static fetchRooms() {
    return firebase.database().ref().child('rooms').once('value').then(node => {
      let rooms = node.val();
      return Object.keys(rooms).map((key, _) => {
        return {
          id: key,
          ...rooms[key]
        }
      })
    })
  };

  static roomByName(name) {
    return firebase.database().ref('rooms').orderByChild('name').equalTo(name).limitToFirst(1).once('value').then(node => {
      let room = node.val();
      let result = room ? Object.keys(room).map((key, _) => {
          return {
            id: key,
            ...room[key]
          }
        })[0] : null;
      return result
    })
  }

  static roomById(id) {
    return firebase.database().ref(`rooms/${id}`).once('value')
      .then(r => {
        return {
          id: r.key,
          ...r.val(),
        };
      })
  }

  static createRoom(name) {
    return this.roomByName(name).then(room => {
      if (!room) {
        return firebase.database().ref('rooms').push({
          name,
          createdAt: {".sv": "timestamp"}
        })
      } else return Promise.resolve(room)
    })
  }

  static name() {
    let currentUser = firebase.auth().currentUser;
    return currentUser.displayName || `anonymous (${currentUser.email})`;
  };


  static postMessage(roomId, message) {
    let currentUser = firebase.auth().currentUser;
    return this.roomById(roomId).then(r => {
      if (r) {
        let payload = {
          message,
          from:  {
            uid: currentUser.uid,
            displayName: this.name()
          },
          at: {".sv": "timestamp"}
        };
        return firebase.database().ref(`channels/${r.id}/messages`).push(payload)
      } else return Promise.reject(new Error(`room id ${roomId} not found`))
    })
  }


  static joinRoom(roomName) {
    let currentUser = firebase.auth().currentUser;
    return this.roomByName(roomName).then(r => {
      if (r) {
        let payload = {displayName : this.name()};
        return firebase.database().ref(`channels/${r.id}/members/${currentUser.uid}`).set(payload)
          .then(_ => this.postMessage(r.id, `${this.name()} entered the room`))
          .then(_ => r)
      } else return Promise.reject(new Error(`room ${roomName} not found`))
    })
  }

  static leaveRoom(roomId) {
    let currentUser = firebase.auth().currentUser;
    return this.roomById(roomId).then(r => {
      if (r) {
        return firebase.database().ref(`channels/${r.id}/members/${currentUser.uid}`).remove()
          .then(_ => this.postMessage(r.id, `${this.name()} left the room`))
          .then(_ => r)
      } else return Promise.reject(new Error(`room id ${roomId} not found`))
    })
  }

  static streamMessages(roomId) {
    return firebase.database().ref(`channels/${roomId}/messages`).limitToLast(10)
  }
  static streamMembers(roomId) {
    return firebase.database().ref(`channels/${roomId}/members`)
  }
}

export default ChatApi
