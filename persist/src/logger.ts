import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    } : undefined,
    // Adding an explicit name to identify this logger instance
    name: 'persist-service'
});

export default logger;
