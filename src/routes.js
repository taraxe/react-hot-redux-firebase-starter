import React from 'react';
import {Route, IndexRoute} from 'react-router';
import Layout from './components/Layout';
import ChatListPage from './components/chat/ChatListPage';
import ChatRoomPage from './components/chat/ChatRoomPage';
import HomePage from './components/home/HomePage';
import AdminPage from './components/admin/AdminPage';
import ProtectedPage from './components/protected/ProtectedPage';
import AboutPage from './components/about/AboutPage';
import LoginPage from './components/login/LoginPage'; //eslint-disable-line import/no-named-as-default
import RegistrationPage from './components/registration/RegistrationPage'; //eslint-disable-line import/no-named-as-default
import {requireAdmin, requireAuth} from './actions/authActions';


export default function Routes(store) {


  const checkAdmin = (nextState, replace, callback) => {
    store.dispatch(requireAdmin(nextState, replace, callback));
  };

  const checkAuth = (nextState, replace) => {
    store.dispatch(requireAuth(nextState, replace));
  };

  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={HomePage}/>
      <Route path="layout" component={Layout}/>
      <Route path="chat" component={ChatListPage} onEnter={checkAuth}/>
      <Route path="chat/:room" component={ChatRoomPage} onEnter={checkAuth}/>
      <Route path="about" component={AboutPage}/>
      <Route path="protected" component={ProtectedPage}/>
      <Route path="admin" component={AdminPage} onEnter={checkAdmin}/>
      <Route path="register" component={RegistrationPage}/>
      <Route path="login" component={LoginPage}/>
    </Route>
  );
}
