import chatApi from '../api/chat';
import * as types from './actionTypes'
import {ajaxCallError, beginAjaxCall} from './ajaxStatusActions';

let errorHandler = dispatch => error => {
  console.error(error);
  dispatch(ajaxCallError(error));
  // @TODO better error handling
  throw(error);
};

export function loadRooms() {
  return (dispatch) => {
    dispatch(beginAjaxCall());
    return chatApi
      .fetchRooms()
      .then(rooms => dispatch(roomsLoadedSuccess(rooms)))
      .catch(errorHandler(dispatch));
  };
}


export function createRoom(name) {
  return (dispatch) => {
    dispatch(beginAjaxCall());
    return chatApi
      .createRoom(name)
      .then(r => dispatch(roomsCreatedSuccess(r)))
      .catch(errorHandler(dispatch));
  };
}

export function postMessage(roomId, message) {
  return (dispatch) => {
    dispatch(beginAjaxCall());
    return chatApi
      .postMessage(roomId, message)
      .then(r => dispatch(postMessageSucess()))
      .catch(errorHandler(dispatch));
  };
}

export function joinRoom(roomName) {
  return (dispatch) => {
    dispatch(beginAjaxCall());
    return chatApi
      .joinRoom(roomName)
      .then(r => {
        dispatch(roomJoinedSuccess(r));
        return r
      })
      .then(r => {
        return Promise.all([chatApi.streamMessages(r.id), chatApi.streamMembers(r.id)])
          .then( values => {
            let [messagesRef, membersRef] = values;
            messagesRef.on('child_added', snap => dispatch(newMessage({mid: snap.key, ...snap.val()})));
            membersRef.on('child_added', snap => dispatch(memberEnter({uid: snap.key, ...snap.val()})));
            membersRef.on('child_removed', snap => dispatch(memberLeft({uid: snap.key, ...snap.val()})));
            return values
          })
      })
      .catch(errorHandler(dispatch));
  };
}

export function leaveRoom(roomId) {
  return (dispatch) => {
      dispatch(beginAjaxCall());
      return chatApi
        .leaveRoom(roomId)
        .then(r => dispatch(roomLeavedSuccess()))
        .catch(errorHandler(dispatch));
  };
}

export function roomsLoadedSuccess(rooms) {
  return {
    type: types.CHAT_LOAD_ROOMS_SUCCESS, rooms
  };
}
export function roomsCreatedSuccess() {
  return {
    type: types.CHAT_CREATE_ROOM_SUCCESS
  };
}
export function roomJoinedSuccess(room, messagesRef, membersRef) {
  return {
    type: types.CHAT_JOIN_ROOM_SUCCESS, room, messagesRef, membersRef
  };
}
export function roomLeavedSuccess() {
  return {
    type: types.CHAT_QUIT_ROOM_SUCCESS
  };
}
export function postMessageSucess() {
  return {
    type: types.CHAT_POST_MESSAGE_SUCCESS
  };
}

export function newMessage(message) {
  return {
    type: types.CHAT_ON_NEW_MESSAGE, message
  };
}
export function memberEnter(member) {
  return {
    type: types.CHAT_ON_MEMBER_ENTER, member
  };
}
export function memberLeft(member) {
  return {
    type: types.CHAT_ON_MEMBER_LEAVE, member
  };
}
