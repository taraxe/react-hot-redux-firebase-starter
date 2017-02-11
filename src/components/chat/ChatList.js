import React from 'react';
import {Link} from 'react-router';

const ChatList = ({rooms}) => {
  return (
    <ul>
      {rooms.map(r =>
        <li key={r.id}><Link to={`/chat/${r.name}`}>{r.name}</Link></li>
      )}
    </ul>
  );
};

ChatList.propTypes = {
  rooms: React.PropTypes.array.isRequired
};

export default ChatList;
