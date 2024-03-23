const http = require('http');
const app = require('./app'); 

const server = http.createServer(app); 
   
const port = process.env.port || 5000;
server.listen(port, () => console.log(`Server listening at http://localhost:${port}`));