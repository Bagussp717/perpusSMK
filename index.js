const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const Router = require("./route/route");
const cors =require ('cors')

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'https://perpuson.vercel.app',
    methods: ["GET", "POST", "DELETE","PUT"],
    credentials: true,
  })
);

app.use(Router);

app.listen(port, () => {
  console.log("Server Ready in https://localhost/", port);
});

// const app = express();
// const port = 5000;
// const bodyParser = require("body-parser");
// const Router = require("./route/route");
// const cors =require ('cors')
// const session = require('express-session')
// const cookieParser = require('cookie-parser')

// app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST", "DELETE"],
//     credentials: true,
//   })
// );

// app.use(cookieParser());
// app.use(session({
//   secret: 'perpusesrisa',
//   resave: true,
//   saveUninitialized: true
// }));

// app.use('/',Router);

// app.listen(port, () => {
//   console.log("Server Ready in https://localhost/", port);
// });

// const express = require('express');
// const jwt = require('jsonwebtoken');

// const app = express();

// app.get('/api', (req, res) => {
//   res.json({
//     message: 'Welcome to the API'
//   });
// });

// app.get('/api/posts', verifyToken, (req, res) => {  
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       res.json({
//         message: 'Post created...',
//         authData
//       });
//     }
//   });
// });

// app.post('/api/login', (req, res) => {
//   // Mock user
//   const user = {
//     id: 1, 
//     username: 'brad',
//     email: 'brad@gmail.com'
//   }

//   jwt.sign({user}, 'secretkey', { expiresIn: '1h' }, (err, token) => {
//     res.json({
//       token
//     });
//   });
// });

// // FORMAT OF TOKEN
// // Authorization: Bearer <access_token>

// // Verify Token
// function verifyToken(req, res, next) {
//   // Get auth header value
//   const bearerHeader = req.headers['authorization'];
//   // Check if bearer is undefined
//   if(typeof bearerHeader !== 'undefined') {
//     // Split at the space
//     const bearer = bearerHeader.split(' ');
//     // Get token from array
//     const bearerToken = bearer[1];
//     // Set the token
//     req.token = bearerToken;
//     // Next middleware
//     next();
//   } else {
//     // Forbidden
//     res.sendStatus(403);
//   }

// }

// app.listen(5000, () => console.log('Server started on port 5000'));