const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: '80',
    routes: {
        cors: true
    }
})

module.exports = server;
