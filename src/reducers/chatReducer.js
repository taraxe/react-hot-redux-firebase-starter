import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function chatReducer(state = initialState.chat, action) {
  switch (action.type) {
    case types.CHAT_LOAD_ROOMS_SUCCESS:
      return Object.assign({}, state, {rooms : action.rooms});
    case types.CHAT_QUIT_ROOM_SUCCESS:
      return Object.assign({}, state, {currentRoom : null});
    case types.CHAT_JOIN_ROOM_SUCCESS:
      let room = {...action.room, members: [], messages: []};
      return Object.assign({}, state, {currentRoom : room});
    case types.CHAT_ON_NEW_MESSAGE:
      if (!state.currentRoom) return state;
      if (state.currentRoom && state.currentRoom.messages.find(m => m.mid === action.message.mid)) return state;
      else {
        let m = action.message,
            newMessage = {...m, at: new Date(m.at), text: m.message, ...m.from},
            update = {
            ...state.currentRoom,
            messages: state.currentRoom.messages.concat([newMessage])
          };
        return Object.assign({}, state, {currentRoom : update});
      }
    case types.CHAT_ON_MEMBER_ENTER:
      if (!state.currentRoom) return state;
      if (state.currentRoom.members.find(m => m.uid === action.member.uid)) return state;
      else {
        let update = {
          ...state.currentRoom,
          members: state.currentRoom.members.concat([action.member])
        };
        return Object.assign({}, state, {currentRoom : update});
      }
    case types.CHAT_ON_MEMBER_LEAVE:
      if (!state.currentRoom) return state;
      let update4 = {
        ...state.currentRoom,
        members: state.currentRoom.members.filter(m => m.uid == action.member.uid)
      };
      return Object.assign({}, state, {currentRoom : update4});

    case types.AUTH_LOGGED_OUT_SUCCESS:
      return initialState.chat;
    default:
      return state;
  }
}
