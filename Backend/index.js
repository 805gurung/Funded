const express = require('express');
require('dotenv').config();
require('./database/Connection');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
const UserRoute = require('./routes/UserRoute');
const CampaignRoute = require('./routes/CampaignRoute')
app.use(UserRoute);
app.use('/api', CampaignRoute)
app.use('/uploads', express.static('uploads'))

app.listen(port, () => {
  console.log(`App started successfully at port ${port}`);
});

module.exports = app;
