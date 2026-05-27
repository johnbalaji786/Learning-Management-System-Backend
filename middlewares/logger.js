const logger = async (req, res, next) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    console.log(`Body: ${JSON.stringify(req.body)}`);
    console.log(`Cookies: ${JSON.stringify(req.cookies)}`);
    console.log('-----------------------------');

    // write the logs to a file
    const fs = require('fs');
    const logEntry = `${req.method} ${req.url} - ${new Date().toISOString()}\nBody: ${JSON.stringify(req.body)}\nCookies: ${JSON.stringify(req.cookies)}\n-----------------------------\n`;

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // create a logs directory if it doesn't exist
    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }

    fs.appendFile(`logs/log-${currentDate}.txt`, logEntry, (err) => {
        if (err) {
            console.error('Error writing log to file:', err);
        }
    });

    next();
}

module.exports = logger;