// backend/config/pusherConfig.js
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1855439',
  key: 'daf3f54495b0ad49389a',
  secret: '6feda8694feb2571bcce',
  cluster: 'ap2',
  useTLS: true,
});

module.exports = pusher;
