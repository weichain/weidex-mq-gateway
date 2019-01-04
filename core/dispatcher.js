const { emitter } = require('./rabbit-mq');

function heartbeat() {
    this.isAlive = true;
}

module.exports = function(socket) {
    socket.isAlive = true;
    socket.on('pong', heartbeat);
    emitter.on('message', sendMessage);
    socket.on('close', function close() {
        emitter.removeListener('message', sendMessage);
    });

    function sendMessage(msg) {
        if (socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(msg));
        }
    }
};
