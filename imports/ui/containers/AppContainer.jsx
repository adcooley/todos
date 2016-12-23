import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import { Lists } from '../../api/lists/lists.js';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  const publicHandle = Meteor.subscribe('lists.public');
  const privateHandle = Meteor.subscribe('lists.private');
  const collaboratorHandle = Meteor.subscribe('lists.collaborator');
  const users = Meteor.subscribe('users');
  return {
    user: Meteor.user(),
    loading: !(publicHandle.ready() && privateHandle.ready() && collaboratorHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen'),
    lists: Lists.find({ $or: [
      { userId: { $exists: false } },
      { userId: Meteor.userId() },
      {collaborators: {$in: [Meteor.userId()]}}
    ] }).fetch(),
  };
}, App);
