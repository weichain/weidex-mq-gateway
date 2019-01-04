'use strict';

const app = require('http').createServer(handler);
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server: app });
const port = process.env.PORT || 5000;
const buildInfo = require('./build-info.json');
const dispatcher = require('./core/dispatcher');
const mqListener = require('./core/rabbit-mq');

function handler(__req, res) {
    res.writeHead(200);
    res.end(JSON.stringify(buildInfo));
}

async function start() {
    await mqListener.init();
    webSocketServer.on('connection', dispatcher);
    setInterval(function ping() {
        webSocketServer.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping(function() {});
        });
    }, 20000);

    app.listen(port);
}

start();
