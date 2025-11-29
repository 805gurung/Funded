const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE)
.then(() => console.log('DB connected'))
.catch((err) => console.log('DB connection error', err));
