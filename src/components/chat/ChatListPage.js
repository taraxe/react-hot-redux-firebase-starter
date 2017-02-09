import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {loadRooms, createRoom, postMessage} from '../../actions/chatActions';
import ChatList from './ChatList';
import toastr from 'toastr';
import checkAuth from '../requireAuth';
import TextInput from '../common/TextInput';


export class ChatListPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loadingRooms : true,
      newRoom: ''
    };
  }

  componentDidMount() {
    this.loadRooms()
  }

  loadRooms = () => {
    this.setState({loadingRooms : true});
    this.props.actions.loadRooms().then(this.endLoading, this.endLoading);
  };

  endLoading = () => {
    this.setState({loadingRooms : false});
  };

  onChange = (event) => {
    event.preventDefault();
    this.setState({newRoom: event.target.value})
  };

  onSave = () => {
    this.props.actions.createRoom(this.state.newRoom).then(_ => {
      toastr.success('Room Created');
      this.setState({newRoom : ''});
      this.loadRooms()
    });
  };

  render() {
    return (
      <div>
        <TextInput
          name="chatroom-name"
          label="new chatroom"
          placeholder="Enter a new channel name"
          onChange={this.onChange}
          value={this.state.newRoom}
        />
        <input
          type="submit"
          value="Create"
          className="btn btn-primary"
          onClick={this.onSave}/>
        <ChatList rooms={this.props.rooms}/>
      </div>
    );
  }
}

ChatListPage.propTypes = {
  actions: PropTypes.object.isRequired,
  rooms: PropTypes.array.isRequired
};

ChatListPage.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  return {
    rooms : state.chat.rooms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({loadRooms, createRoom, postMessage }, dispatch)
  };
}

export default checkAuth(connect(mapStateToProps, mapDispatchToProps)(ChatListPage));
