const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBIT_URL;

let connection, channel;

async function connect() {
    if (!RABBIT_URL) {
        throw new Error('RabbitMQ URL is not defined in the environment variables.');
    }

    try {
        connection = await amqp.connect(RABBIT_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        throw error;
    }
}

async function subscribeToQueue(queueName, callback) {
    if (!channel) await connect();

    try {
        await channel.assertQueue(queueName);
        channel.consume(queueName, (message) => {
            try {
                callback(message.content.toString());
                channel.ack(message);
            } catch (callbackError) {
                console.error('Error in message callback:', callbackError);
            }
        });
        console.log(`Subscribed to queue: ${queueName}`);
    } catch (error) {
        console.error(`Error subscribing to queue "${queueName}":`, error);
        throw error;
    }
}

async function publishToQueue(queueName, data) {
    if (!channel) await connect();

    try {
        await channel.assertQueue(queueName);
        channel.sendToQueue(queueName, Buffer.from(data));
        console.log(`Message sent to queue "${queueName}":`, data);
    } catch (error) {
        console.error(`Error publishing to queue "${queueName}":`, error);
        throw error;
    }
}

async function cleanup() {
    try {
        if (channel) await channel.close();
        if (connection) await connection.close();
        console.log('RabbitMQ connection closed');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = {
    subscribeToQueue,
    publishToQueue,
    connect,
};
