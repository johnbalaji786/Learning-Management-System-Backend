const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config.js');
const { PORT } = require('./utils/config.js');
const app = require('./app');

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
     });

    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });