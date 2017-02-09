export default {
  routesPermissions: {
    requireAuth: [
      '/admin'
    ],
    routesRequireAdmin: [
      '/admin'
    ]
  },
  routing: {},
  user: {
    isAdmin: undefined
  },
  chat: {
    rooms : [],
    currentRoom: null
  },
  auth: {
    isLogged: false,
    currentUserUID: null,
    initialized: false
  },
  ajaxCallsInProgress: 0
};
