import React from 'react';
import {Link} from 'react-router';

const ChatRoom = ({name, onLeave}) => {
  return (
    <div>
      <h1>{name}</h1>
      <a href="#" onClick={onLeave}>Leave room</a>
    </div>
  );
};

export default ChatRoom;
