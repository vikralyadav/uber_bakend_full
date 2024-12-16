const http = require('http')

const app = require('./app');


const server = http.createServer(app);

server.listen(3002, ()=>{
    console.log('listening on 3001 as captain service')
});