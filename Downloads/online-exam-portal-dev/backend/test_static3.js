const http = require('http');

http.get('http://localhost:5000/uploads/optImg1-1782895029833-40907132.png', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  process.exit(0);
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
  process.exit(1);
});
