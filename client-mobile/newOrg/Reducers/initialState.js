module.exports = initialState = {

  data: {
    user: null, //{userModel},
    household: null, //{householdModel},
    items: {
      bought: [], //[itemModel],
      pending: [], //[itemModel],
    },
    roommates: null, //[{userModel}]
    reckonings: [], /*[
      {
        reckoning: reckoningModel,
        items: [], //only fetch when viewing a reckoning?
        userFigures: [], //same as above
      },
    ],*/
    finalReckoning: null,
    invitations: {
      sent: [], //[invitationModel],
      received: [], //[invitationModel],
    },
  },

  uiMode: {
    entryMode: 'login', //'signup'
    selectedHomeTab: 'itemsTab', //'reckoningsTab', 'settingsTab'
    itemsViewMode: 'details', //'list'
    itemsFilter: 'pending', //'bought'
    addItemRequestStatus: null, // 'pending', 'succeeded', 'failed'
    addItemRequestError: null, // message: string
    // itemDetails: 'list', //'details', 'add'
    reckoningsViewMode: 'list', //'details'
    selectedReckoning: null, //reckoningId; TODO: rename to reflect that it's an ID?
    selectedItem: null, //itemId; TODO: rename to reflect that it's an ID?
    reckoningDetailsMode: 'totals', //'payments'
    reckoningsSelectedItem: null, //itemId; TODO: rename to reflect that it's an ID?
    settingsViewMode: 'options', //'invite', 'confirm', 'leave'},

  token: null,

};
