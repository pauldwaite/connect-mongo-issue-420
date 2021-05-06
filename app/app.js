'use strict';

const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
// connect-mongo 3.2.0
// -------------------
const MongoStore = require('connect-mongo')(session);

// connect-mongo 4.4.1
// -------------------
// const MongoStore = require('connect-mongo');


const app = express();


app.use(session({
  name: 'connect-mongo-test-session',
  secret: 'cookie secret',

  // connect-mongo 3.2.0
  // -------------------
  store: new MongoStore({
    url: 'mongodb://mongo:27017/sessiondb',
    ttl: 1000*60*5,
    secret: 'session store secret',
  }),

  // connect-mongo 4.4.1
  // -------------------
  // store: MongoStore.create({
  //   mongoUrl: 'mongodb://mongo:27017/sessiondb',
  //   ttl: 1000*60*5,
  //   crypto: {
  //     secret: 'session store secret',
  //   },
  // }),

  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000*60*5,
  },
}));



// Routes
const router = express.Router();

router.route('/').get( (req, res) => {

  res.redirect('/1');
} );

router.route('/1').get( (req, res) => {
  req.session.pages = req.session.pages || [];
  req.session.pages.push('/1');

  res.status(200).type('text/plain').send(`1. NO PROBLEMS HERE\nsession:\n${JSON.stringify(req.session, null, 2)}`);
} );

router.route('/2').get( (req, res) => {
  req.session.pages = req.session.pages || [];
  req.session.pages.push('/2');

  res.status(200).type('text/plain').send(`2. NO PROBLEMS HERE EITHER\nsession:\n${JSON.stringify(req.session, null, 2)}`);
} );

router.route('/3').get( (req, res) => {
  req.session.pages = req.session.pages || [];
  req.session.pages.push('/3');

  res.status(200).type('text/plain').send(`3. STILL NO PROBLEMS HERE\nsession:\n${JSON.stringify(req.session, null, 2)}`);
});

router.route('/4').get( (req, res) => {
  req.session.pages = req.session.pages || [];
  req.session.pages.push('/4');

  res.status(200).type('text/plain').send(`4. WE STILL GOOD\nsession:\n${JSON.stringify(req.session, null, 2)}`);
});

app.use('/', router);



app.use((req, res) => {
  res.status(404).type('text/plain').send('NOT FOUND');
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).type('text/plain').send(`SERVER ERROR
    ${err.stack}`);
});



const server = app.listen('8080', () => console.log('Test app listening on 8080'));

process.on('SIGINT', () => {
  server.close(() => {
    process.exit();
  });
});
