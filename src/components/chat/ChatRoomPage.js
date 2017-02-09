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
      loadingRoom : true
    };
  }

  componentDidMount() {
    this.joinRoom()
  }

  joinRoom = () => {
    this.setState({loadingRoom : true});
    this.props.actions.joinRoom(this.props.params.room).then(this.endLoading, this.endLoading);
  };

  leaveRoom = (event) => {
    event.preventDefault();
    this.props.actions.leaveRoom(this.props.room.id).then(_ => {
      this.context.router.push('/chat');
    })
  };

  endLoading = () => {
    this.setState({loadingRoom: false});
  };

  render() {
    return (
      <ChatRoom room={this.props.room} onLeave={this.leaveRoom}/>
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
    actions: bindActionCreators({joinRoom, postMessage, leaveRoom }, dispatch)
  };
}

export default checkAuth(connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage));
