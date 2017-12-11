const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: '80',
    routes: {
        cors: true
    }
})

module.exports = server;
