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
        return {id: r.key, ...r.val()};
      })
  }

  static createRoom(name) {
    return this.roomByName(name).then(room => {
      console.log("create room", room);
      if (!room) {
        return firebase.database().ref('rooms').push({
          name,
          members: [],
          createdAt: {".sv": "timestamp"}
        })
      } else return Promise.resolve(room)
    })
  }

  static postMessage(roomId, message) {
    let currentUser = firebase.auth().currentUser;
    return this.roomById(roomId).then(r => {
      if (r) {
        console.log('post message', r);
        let payload = {
          message,
          from: currentUser.displayName || currentUser.email,
          createdAt: {".sv": "timestamp"}
        };
        return firebase.database().ref(`rooms/${r.id}/messages`).push(payload)
      } else return Promise.reject()
    })
  }

  static joinRoom(roomName) {
    let currentUser = firebase.auth().currentUser;
    return this.roomByName(roomName).then(r => {
      if (r) {
        let displayName = currentUser.displayName || 'anonymous';
        let payload = {displayName};
        return firebase.database().ref(`rooms/${r.id}/members/${currentUser.uid}`).set(payload).then(_ => r)
      } else return Promise.reject()
    })
  }

  static leaveRoom(roomId) {
    let currentUser = firebase.auth().currentUser;
    return this.roomById(roomId).then(r => {
      if (r) {
        return firebase.database().ref(`rooms/${r.id}/members/${currentUser.uid}`).remove().then(_ => r)
      } else Promise.reject()
    })

  }
}

export default ChatApi
