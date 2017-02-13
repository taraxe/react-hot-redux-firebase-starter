import React from 'react';
import TextInput from '../common/TextInput';

const MessageText = (message) => {
  return `${message.from.displayName} at ${message.at.toISOString()}: ${message.text}`;
}

const ChatRoom = ({name, members, messages, onLeave, onMessage, onSubmitMessage, canSubmit, pendingMessage}) => {
  return (
    <div>
      <h1>{name} <small><a href="#" onClick={onLeave}>Leave</a></small></h1>
      <h2>Members</h2>
        <ul>
        {members.map((m,i) => <li key={`member-${i}`}>{m.displayName}</li>)}
      </ul>
      <textarea cols="100" rows="10" value={messages.map(MessageText).join('\n')} readOnly/>
      <TextInput name="message" label="message" onChange={onMessage} value={pendingMessage}/>
      <input
        type="submit"
        disabled={!canSubmit}
        value="Create"
        className="btn btn-primary"
        onClick={onSubmitMessage}/>
    </div>
  );
};

ChatRoom.propTypes = {
  //room: React.PropTypes.object.isRequired,
  onLeave: React.PropTypes.func.isRequired,
  onMessage: React.PropTypes.func.isRequired,
  onSubmitMessage: React.PropTypes.func.isRequired,
  canSubmit: React.PropTypes.bool.isRequired
};

export default ChatRoom;
