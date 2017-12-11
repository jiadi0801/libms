const server = require('./node/server');
const fs = require('fs');

require('./node/routes')

server.route({
    method: 'GET',
    path: '/',
    handler: function (req, reply) {
        reply(fs.readFileSync('./webapp/index.html').toString())
            .type('text/html');
    }
})


server.start(() => {
    console.log(server.connections[0].info.uri)
})
