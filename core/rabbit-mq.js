'use strict';

const amqp = require('amqplib');
const queues = require('./queues');
const logger = require('./logger');

const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

module.exports = {
    init,
    emitter,
};

const rabbitMqServer = process.env.MQ_CONNECTION_STRING;
logger.info(`Message queue is connected via: ${rabbitMqServer}`);

let channel;

async function init() {
    const connection = await amqp.connect(rabbitMqServer);
    channel = await connection.createChannel();

    Object.values(queues).forEach(queueName => {
        const messageExtractor = async msg => {
            logger.info(JSON.parse(msg.content));
            emitter.emit('message', {
                eventType: msg.fields.routingKey,
                ...JSON.parse(msg.content),
            });
        };
        channel.consume(queueName, messageExtractor, { noAck: true });
        logger.info('Listening on ' + queueName);
    });
}
