// var AuthActions = require('./subActions/AuthActions');
// var HouseholdActions = require('./subActions/HouseholdActions');
// var InvitationActions = require('./subActions/InvitationActions');
// var ItemActions = require('./subActions/ItemActions');
// var ReckoningActions = require('./subActions/ReckoningActions');
// var UIModeActions = require('./subActions/UIModeActions');

// module.exports = {
//   ...AuthActions,
//   ...HouseholdActions,
//   ...InvitationActions,
//   ...ItemActions,
//   ...ReckoningActions,
//   ...UIModeActions,
// };

// LOGIN: submit username/password to server for verification, and handle success or failure

// LOGIN: submit username/password to server for verification, and handle success or failure

var Network = require('./Network');

exports.login = function(username, password) {
  // Thunk
  return function(dispatch) {
    return Network.login(username, password)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (!response.ok) {
              return dispatch(loginFailure(body));
            } else {
              return dispatch(loginSuccess(body));
            }
          });
        // if (response.ok) {
        //   return response.json()
        //     .then(function(body) {
        //       console.log('dispatching loginSuccess: ' + body);
        //       return dispatch(loginSuccess(body));
        //     });
        // } else {
        //   return dispatch(loginFailure(response.statusText));
        // }
      })
      .catch(function(error) {
        return dispatch(loginFailure(error.message));
      });
  };
};

// LOGIN_SUCCESS: set token, user, and household(optional) from server's response into store
function loginSuccess(data) {

  return {
    type: 'LOGIN_SUCCESS',
    payload: {
      token: data.token,
      user: data.userData,
      household: data.household || null,
      roommates: data.roommates || null,
      invitations: data.invitations || null,
    },
  };
}

// LOGIN_FAILURE: display error message?

function loginFailure(message) {
  return {
    type: 'LOGIN_FAILURE',
    payload: {message},
    error: true,
  };
}

// LOGOUT: remove token and set state to initial?

exports.logout = function() {
  return {
    type: 'LOGOUT',
  };
};

// SIGNUP: submit username/password to server for creation of user; set token and user from server's response into store

exports.signup = function(username, password) {

  return function(dispatch) {
    return Network.signup(username, password)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(signupSuccess(body));
            } else {
              return dispatch(signupFailure(body));
            }
          });
      })
      .catch(function(error) {
        console.log(error);
        return dispatch(signupFailure(error.message));
      });
  };
};

function signupSuccess(data) {
  return {
    type: 'SIGNUP_SUCCESS',
    payload: {
      token: data.token,
      user: data.user,
      //always null on sign up
      household: null,
    },
  };
}

function signupFailure(message) {
  return {
    type: 'SIGNUP_FAILURE',
    payload: {message},
    error: true,
  };
}


// exports.fetchPendingInvites = function() {
//   return function(dispatch) {
//     return Network.getInvitationOutbox()
//       .then(function(response) {
//         console.log('GET INVITATION OUTBOX RESPONSE');
//         console.log(response);
//         return response.json()
//           .then(function(body) {
//             if (response.ok) {
//               return dispatch(fetchPendingInvitesSuccess(body));
//             }
//           });
//       });
//   };
// };

// function fetchPendingInvitesSuccess(data) {
//   console.log('FETCH PENDING INVITES');
//   console.log(data);
//   return {
//     type: 'FETCH_PENDING_INVITES_SUCCESS',
//     payload: {
//       invites: data,
//     },
//   };
// }

exports.fetchItemLists = function() {
  return function(dispatch) {
    Network.getItems()
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(fetchItemListsSuccess(body));
            }
          });
      });
  };
};

function fetchItemListsSuccess(data) {
  return {
    type: 'FETCH_ITEM_LISTS_SUCCESS',
    payload: {
      items: data,
    },
  };
}

// ENTRYMODE_LOGIN: set state.uiMode.entryMode to 'login'; navigate to login screen

// ENTRYMODE_SIGNUP: set state.uiMode.entryMode to 'signup'; navigate to signup screen

  // or, SET_ENTRY_MODE, with payload of 'login' or 'signup' ?
exports.setEntryMode = function(mode) {
  return {
    type: 'SET_ENTRY_MODE',
    payload: {mode},
  };
};

//ADD HOUSEHOLD
exports.addHousehold = function(householdName) {
  return function(dispatch) {
    return Network.addHousehold(householdName)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
             return dispatch(addHouseholdSuccess(body));
            } else {
             return dispatch(addHouseholdFailure(body));
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      })
      .catch(function(error) {
        console.log(error);
        return dispatch(addHouseholdFailure(error.message));
      });
  };
};

// ADD_HOUSEHOLD_SUCCESS
function addHouseholdSuccess(data) {
  return {
    type: 'ADD_HOUSEHOLD_SUCCESS',
    payload: {
      user: data.user,
      household: data.household,
      token: data.token,
    },
  };
}

// ADD_HOUSEHOLD_FAILURE: display error message?
function addHouseholdFailure(message) {
  return {
    type: 'ADD_HOUSEHOLD_FAILURE',
    payload: {message},
    error: true,
  };
}

// exports.fetchInvitationInbox = function(username, password) {

//   return function(dispatch) {
//     return Network.signup(username, password)
//       .then(function(response) {
//         return response.json()
//           .then(function(body) {
//             if (response.ok) {
//               return dispatch(signupSuccess(body));
//             } else {
//               return dispatch(signupFailure(body));
//             }
//           });
//       })
//       .catch(function(error) {
//         console.log(error);
//         return dispatch(signupFailure(error.message));
//       });
//   };
// };

exports.addInvitation = function(toUsername) {
  console.log('addinvitation from Actions being called with: ', toUsername);
  return function(dispatch) {
    return Network.inviteUser(toUsername)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(addInvitationSuccess(body));
            } else {
              return dispatch(addInvitationFailure(body));
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      });
  };
};

function addInvitationSuccess(data) {
  return {
    type: 'ADD_INVITATION_SUCCESS',
    payload: {
      invitations: data.invitations,
    },
  };
}

function addInvitationFailure() {
  return {
    type: 'ADD_INVITATION_FAILURE',
  };
}

// JOIN_HOUSEHOLD
exports.updateInvitation = function(status, invitationId) {
  return function(dispatch) {
    return Network.respondToInvitation(status, invitationId)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(updateInvitationSuccess(body));
            } else {
              return dispatch(updateInvitationFailure(body));
            }
          });
      })
      .catch(function(error) {
        console.log(error);
        return dispatch(updateInvitationFailure(error.message));
      });
  };
};

// UPDATE_INVITATION_SUCCESS
function updateInvitationSuccess(data) {
  console.log('updateInvitationSuccess action being created');
  return {
    type: 'UPDATE_INVITATION_SUCCESS',
    payload: {
      invitations: data.invitations,
      household: data.household || null,
      token: data.token,
    },
  };
}

// UPDATE_INVITATION_FAILURE
function updateInvitationFailure(message) {
  return {
    type: 'UPDATE_INVITATION_FAILURE',
    payload: {message},
    error: true,
  };
}

// SET_HOMETAB, with payload of 'items', 'reckonings', or 'settings' ?
exports.setHomeTab = function(mode) {
  return {
    type: 'SET_HOME_TAB',
    payload: {mode},
  };
};

exports.setItemsViewMode = function(mode) {
  return {
    type: 'SET_ITEMS_VIEW_MODE',
    payload: {mode},
  };
};

// SET_ITEMS_FILTER, with payload of 'pending' or 'bought' ?
exports.setItemsFilter = function(filter) {
  return {
    type: 'SET_ITEMS_FILTER',
    payload: {filter},
  };
};

exports.addItem = function(item) {
  return function(dispatch) {
    return Network.addItem(item)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(addItemSuccess(body.item));
            } else {
              return dispatch(addItemFailure(body.error));
            }
          });
      });
  };
};

function addItemSuccess(item) {
  return {
    type: 'ADD_ITEM_SUCCESS',
    payload: {item},
  };
}

function addItemFailure(error) {
  return {
    type: 'ADD_ITEM_FAILURE',
    payload: {error},
  };
}

exports.setAddItemRequestStatus = function(status) {
  return {
    type: 'SET_ADD_ITEM_REQUEST_STATUS',
    payload: {status},
  };
};

exports.selectItem = function(item) {
  console.log('selecting item ' + item);
  return {
    type: 'SELECT_ITEM',
    payload: {itemId: item.id},
  };
};

exports.updateItem = function(updates) {

  //Thunk
  return function(dispatch) {
    return Network.updateItem(updates)
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(updateItemSuccess(body));
            } else {
              return dispatch(updateItemFailure(body));
            }
          });
      })
      .catch(function(error) {
        console.log(error);
        return dispatch(updateItemFailure(error.message));
      });
  };
};

function updateItemSuccess(data) {
  console.log('making updateItemSuccess action');
  return {
    type: 'UPDATE_ITEM_SUCCESS',
    payload: {
      items: data,
    },
  };
}

function updateItemFailure(message) {
  console.log('making updateItemFailure action');
  return {
    type: 'UPDATE_ITEM_FAILURE',
    payload: {message},
    error: true,
  };
}
// GET_RECKONINGS: grab list of household's associated reckonings for display as list
exports.fetchReckoningLists = function() {
  return function(dispatch) {
    Network.getReckoning()
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(fetchReckoningListsSuccess(body));
            }
          });
      });
  };
};

function fetchReckoningListsSuccess(data) {
  return {
    type: 'FETCH_RECKONING_LISTS_SUCCESS',
    payload: {
      reckonings: data,
    },
  };
}

exports.fetchSelectedReckoning = function() {
  return function(dispatch) {
    dispatch({type: 'FETCH_SELECTED_RECKONING_PENDING'});
    return Network.getSelectedReckoning()
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(fetchSelectedReckoningSuccess(body));
            }
          });
      });
  };
};

function fetchSelectedReckoningSuccess(data) {
  return {
    type: 'FETCH_SELECTED_RECKONING_SUCCESS',
    payload: {
      reckoning: data.reckoning,
    },
  };
}

// GET_HOME_ITEMS: grab list of household's current unreckoned items (split into bought and pending)
// and set into state.data.items.bought and state.data.items.pending

// GET_RECKONING_DATA: get associated users and items with reckoning; coordinate with server

// SELECT_RECKONING: set state.uiMode.selectedReckoning to payload reckoning id
exports.selectReckoning = function(reckoning) {
  return {
    type: 'SELECT_RECKONING',
    payload: {reckoningId: reckoning.id},
  };
};

// SET_RECKONINGS_VIEW_MODE: 'list', 'details'
exports.setReckoningsViewMode = function(mode) {
  return {
    type: 'SET_RECKONINGS_VIEW_MODE',
    payload: {mode},
  };
};

// SET_RECKONINGS_DETAILS_MODE: 'items', 'users'


// RECKONING_SELECT_ITEM: set state.uiMode.reckoningsSelectedItem to payload item id
exports.setReckoningDetailsMode = function(mode) {
  return {
    type: 'SET_RECKONING_DETAILS_MODE',
    payload: {mode},
  };
};

// SET_SETTINGS_VIEW_MODE
exports.setSettingsViewMode = function(mode) {
  if (mode === 'leave') {
    return exports.initiateReckoning(true);
  } else {
    return settingsViewMode(mode);
  }
};

function settingsViewMode(mode) {
  return {
    type: 'SET_SETTINGS_VIEW_MODE',
    payload: {mode},
  };
}

exports.initiateReckoning = function(shouldSetSettingsViewModeToLeave) {

  return function(dispatch) {
    dispatch({type: 'INITIATE_RECKONING'});
    return Network.initiateReckoning()
      .then(function(response) {
        console.log(response);
        if (response.status === 204) {
          if (shouldSetSettingsViewModeToLeave) {
            dispatch(settingsViewMode('leave'));
          }
          dispatch(initiateReckoningSuccess());
        } else if (response.status === 201) {
          return response.json()
            .then(function(body) {
              if (shouldSetSettingsViewModeToLeave) {
                dispatch(settingsViewMode('leave'));
                dispatch(exports.selectReckoning(body.reckoning));
              }
              dispatch(initiateReckoningSuccess(body));
            });
        }
      })
      .catch(function(error) {
        console.log(error);
        return dispatch(initiateReckoningFailure(error.message));
      });
  };
};

// INITIATE_RECKONING_SUCCESS
function initiateReckoningSuccess(data) {
  var reckoning = data == null ? null : data.reckoning;
  return {
    type: 'INITIATE_RECKONING_SUCCESS',
    payload: {
      reckoning: reckoning || null,
    },
  };
}

// INITIATE_RECKONING_FAILURE
function initiateReckoningFailure(message) {
  return {
    type: 'INITIATE_RECKONING_FAILURE',
    payload: {message},
    error: true,
  };
}

exports.leaveHousehold = function() {
  return function(dispatch) {
    return Network.updateUser({householdId: null})
      .then(function(response) {
        return response.json()
          .then(function(body) {
            if (response.ok) {
              return dispatch(leaveHouseholdSuccess(body));
            } else {
              return dispatch(leaveHouseholdFailure(body));
            }
          })
          .catch(function(error) {
            return dispatch(leaveHouseholdFailure(error.message));
          });
      })
      .catch(function(error) {
        return dispatch(leaveHouseholdFailure(error.message));
      });
  };
};

function leaveHouseholdSuccess(body) {
  return {
    type: 'LEAVE_HOUSEHOLD_SUCCESS',
    payload: {
      user: body.user,
      token: body.token,
    },
  };
}

function leaveHouseholdFailure(message) {
  return {
    type: 'LEAVE_HOUSEHOLD_FAILURE',
    payload: {message},
    error: true,
  };
}
