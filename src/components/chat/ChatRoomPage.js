import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {joinRoom, leaveRoom, postMessage} from '../../actions/chatActions';
import ChatRoom from './ChatRoom';
import toastr from 'toastr';
import checkAuth from '../requireAuth';


export class ChatRoomPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loadingRoom : true,
      messagesRef: null,
      membersRef: null,
      nextMessage: ''
    };
  }

  componentDidMount() {
    this.joinRoom()
  }

  componentWillUnmount() {
    if (this.props.room) {
      this.props.actions.leaveRoom(this.props.room.id).then(_ => {
        this.state.membersRef.off();
        this.state.messagesRef.off();
      })
    }
  }

  joinRoom = () => {
    this.setState({loadingRoom : true});
    this.props.actions.joinRoom(this.props.params.room)
      .then(refs => {
        let [messagesRef, membersRef] = refs;
        this.setState({loadingRoom: false, messagesRef, membersRef});
      })
  };

  leaveRoom = (event) => {
    event.preventDefault();
    this.props.actions.leaveRoom(this.props.room.id).then(_ => {
      this.context.router.push('/chat');
    })
  };

  onMessage = (event) => {
    event.preventDefault();
    this.setState({nextMessage: event.target.value})
  };

  clearMessage = () => {
    this.setState({nextMessage: ''})
  };

  submitMessage = () => {
    this.props.actions.postMessage(this.props.room.id, this.state.nextMessage).then( _ =>
      this.clearMessage()
    )
  };

  render() {
    return (
      this.props.room ?
        <ChatRoom {...this.props.room}
                  onLeave={this.leaveRoom}
                  onMessage={this.onMessage}
                  onSubmitMessage={this.submitMessage}
                  canSubmit={this.state.nextMessage != ''}
                  pendingMessage={this.state.nextMessage}
        /> : <span>Loading</span>
    );
  }
}

ChatRoomPage.propTypes = {
  actions: PropTypes.object.isRequired,
  room: PropTypes.object
};

ChatRoomPage.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {
    room : state.chat.currentRoom,
    uid: state.auth.currentUserUID
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({joinRoom, postMessage, leaveRoom}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage);
