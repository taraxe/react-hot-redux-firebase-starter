import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function chatReducer(state = initialState.chat, action) {
  switch (action.type) {
    case types.CHAT_LOAD_ROOMS_SUCCESS:
      return Object.assign({}, state, {rooms : action.rooms});
    case types.CHAT_QUIT_ROOM_SUCCESS:
      return Object.assign({}, state, {currentRoom : null});
    case types.CHAT_JOIN_ROOM_SUCCESS:
      return Object.assign({}, state, {currentRoom : action.room});

    case types.AUTH_LOGGED_OUT_SUCCESS:
      return initialState.chat;
    default:
      return state;
  }
}
