const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: '8000',
    routes: {
        cors: true
    }
})

module.exports = server;
