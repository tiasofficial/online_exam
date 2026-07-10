const http = require('http');

http.get('http://localhost:5000/uploads/bodyImage-1782895699073-239623401.png', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  process.exit(0);
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
  process.exit(1);
});
