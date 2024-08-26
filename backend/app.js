// backend/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sendSOSAlert } = require('./controllers/alertController');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send-alert', sendSOSAlert);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
