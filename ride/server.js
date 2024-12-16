const http = require('http')

const app = require('./app');


const server = http.createServer(app);

server.listen(3003, ()=>{
    console.log('listening on 3003 as ride service')
});