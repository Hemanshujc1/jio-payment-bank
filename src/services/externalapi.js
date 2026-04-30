const https = require('https');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'server.key'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, 'server.crt'), 'utf8'); // Sometimes needed for the CA bundle

const credentials = { key: privateKey, cert: certificate, ca: ca };


const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');
const session = require('express-session');

const app = express();

// Session setup
app.use(session({ secret: 'v-sanchar-secret', resave: false, saveUninitialized: true }));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


// Middleware to log response headers
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
      // Log response headers
      req.headers['authorization'] = 'Basic dnNob3Atc2l0OnYtc2FuY2hhci1zZWNyZXQ=';  // Add your custom header here
      req.headers['Custom-Header'] = 'application/x-www-form-urlencoded';  // Add your custom header here

      console.log('Response Headers:', res.getHeaders());
      originalSend.call(this, body); // Call the original res.send function
    };
    next();
  });

// OAuth2 strategy configuration
passport.use(new OAuth2Strategy({
  authorizationURL: 'https://authsit.vakrangee.in/oauth/authorize',  // Spring OAuth2 Authorization URL
  tokenURL: 'https://authsit.vakrangee.in/oauth/token',              // Spring OAuth2 Token URL
  clientID: 'reactsso-dev',                                       // Your OAuth2 Client ID from Spring Security
  clientSecret: 'v-sanchar-secret',                                // Your OAuth2 Client Secret from Spring Security
  callbackURL: 'https://localhost:3000/auth/callback',              // Callback URL
  scope: 'read',                                             // OAuth2 Scope
  grant_type:'authorization_code',
  response_type:'code',
  customHeaders: {
    'authorization': 'Basic cmVhY3Rzc28tZGV2OnYtc2FuY2hhci1zZWNyZXQ=',
    'content-type': 'application/x-www-form-urlencoded',  // Add your custom header here
}
}, function(accessToken, refreshToken, profile, done) {
  // This function is called after successful OAuth2 login
  console.log('Access Token:', accessToken);
  return done(null, { accessToken, profile });
}));



// You can also modify the token exchange process to use axios directly:
OAuth2Strategy.prototype.getOAuthAccessToken = function(code, params, callback) {
  const url = this._getAccessTokenUrl(code);
 
  // Use axios to pass custom headers in the request
  axios.post(url, params, {
    headers: {
      'authorization': 'Basic cmVhY3Rzc28tZGV2OnYtc2FuY2hhci1zZWNyZXQ=',
      'content-type': 'application/x-www-form-urlencoded',  // Add your custom header here
    }
  }).then((response) => {
    callback(null, response.data.access_token, response.data.refresh_token);
  }).catch((error) => {
    callback(error);
  });
};

// Catch the error during OAuth2 token exchange
OAuth2Strategy.prototype.parseErrorResponse = function(body) {
    console.log("OAuth2 Error Response:", body);  // Log the error response body for debugging
    const parsedError = JSON.parse(body);
    return parsedError;
  };

// Serialize user into session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Route to initiate OAuth2 login
app.get('/auth', (req, res) => {

   
   
  passport.authenticate('oauth2')(req, res);
  console.log('Request Headers:', req.headers); // Log request headers
  console.log('Response Headers:', res.getHeaders());
});

// OAuth2 callback endpoint
app.get('/auth/callback', (req, res, next) => {
    console.log('Authorization Code:', req.query.code); // Log the authorization code
  passport.authenticate('oauth2', { failureRedirect: '/' }, (err, user) => {
    if (err) {
      return next(err);
    }


    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/profile');
    });
  })(req, res, next);
});

// Profile route to show authenticated user's info
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
//  res.json(req.user);  // Display user profile here

 
  const accessToken = req.user.accessToken;
  console.log('Access Token '+accessToken);

  const jsn = accessToken.split(".")[1];

  console.log('Json String '+jsn);

  const decodedUser = Buffer.from(jsn, 'base64').toString('utf-8');
  console.log('Decoded User '+decodedUser);


  // Parse the JSON string into a JavaScript object
const jsonObject = JSON.parse(decodedUser);


  console.log('Mobile Number '+jsonObject.mobile_number);

  res.json('Welcome: '+jsonObject.user_id +' '+jsonObject.email_id+' '+  jsonObject.user_name+' '+jsonObject.mobile_number);

 
 


});

const server = https.createServer(credentials, app);
// Start the server
server.listen(3000, () => {
  console.log('Server is running on https://localhost:3000');
});