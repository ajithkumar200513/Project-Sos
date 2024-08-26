// backend/controllers/alertController.js
const pusher = require('../config/pusherConfig');

const sendSOSAlert = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  pusher.trigger('sos-channel', 'sos-alert', {
    message,
  });

  res.status(200).json({ success: 'Alert sent successfully' });
};

module.exports = { sendSOSAlert };
