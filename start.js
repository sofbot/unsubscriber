var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('src/index.js');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
}).listen(9615);