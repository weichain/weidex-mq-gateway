const winston = require('winston');

function getLogLevel() {
    return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            level: getLogLevel(),
        }),
    ],
});

module.exports = logger;
