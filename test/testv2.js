
// // Node.js program to demonstrate the 
// // Process 'message' Event
 
// // Importing process module
// const cp = require('child_process');
 
// // Initiating child process
// const process = cp.fork(`${__dirname}/testv2.js`);
 
// // Message Event
// process.on('message', (m) => {
//     console.log('PARENT got message:', m);
// });
 
// // Causes the child to print:
// // CHILD got message: { hello: 'world' }
// process.send({ hello: 'world' });

const crypto = require('crypto');
const RandPass = Array.from({ length: 101 }, (_, i) => crypto.randomBytes(5).toString('hex'));
console.log(RandPass);