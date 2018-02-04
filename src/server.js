import express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import favicon from 'serve-favicon';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import VError from 'verror';
import PrettyError from 'pretty-error';
import http from 'http';
import httpProxy from 'http-proxy';
import apiClient from './helpers/apiClient';
import cors from 'cors';
import headers from './utils/headers';
import asyncMiddleware from './utils/asyncMiddleware';
import apiRoutes from '../api/apiRoutes';

import { StaticRouter } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createMemoryHistory from 'history/createMemoryHistory';
import { Provider } from 'react-redux';
import config from './config';
import createStore from './redux/create';
import Html from './helpers/Html';
import routes from './routes';
import { parse as parseUrl } from 'url';

process.on('unhandledRejection', error => {
  console.error(error);
});

const targetUrl = 'http://localhost:3000';
//const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
const pretty = new PrettyError();
const app = new express();
//const server = new http.Server(app);
//const proxy = httpProxy.createProxyServer({ target: targetUrl, ws: true });

app.use(morgan('dev'));

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '..', 'static', 'manifest.json')));

app.use('/dist/service-worker.js', (req, res, next) => {
  res.setHeader('Service-Worker-Allowed', '/');
  return next();
});

app.use(express.static(path.join(__dirname, '..', 'static')));

// #########################################################################

app.use(headers);

// #########################################################################

app.use((req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>>>>>>> GOING THROUGH APP NOW >>>>>>>>>>>>>>>>>>');
  console.log('REQ.ip +++++: ', req.ip);
  console.log('REQ.method +++++: ', req.method);
  console.log('REQ.url ++++++++: ', req.url);
  console.log('REQ.originalUrl ++++++++: ', req.originalUrl);
  console.log('REQ.headers ++++: ', req.headers);
  if(req.user) {
    console.log('REQ.user +++++: ', req.user);
    console.log('REQ.user._id +: ', req.user._id);
  } else {
    console.log('REQ.user +++++: NO USER');
  };
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
  return next();
});

// #########################################################################

// trust proxy: indicates the app is behind a proxy, and to use the X-Forwarded-* headers
// app.set(name, value): Assigns setting name to value
// app.set('trust proxy', 1);
app.use('/api', apiRoutes);

app.use('/ws', (req, res, next) => {
  console.log('>>>>>>>>>>>>>>>>> !!!!!!!!!!! WS - app.use !!!!!!!!!!!! <<<<<<<<<<<<<<<<<<<');
  return next();
});

// #########################################################################

import session from 'express-session';
import mongoose from 'mongoose';

const MongoStore = require('connect-mongo')(session);

app.use(session({
  secret: 'react and redux rule!!!!',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: 'mongodb://localhost/apptest2018',
    touchAfter: 0.5 * 3600 // time period in seconds
  })
}));

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/apptest2018');

// #########################################################################

app.use(async (req, res) => {
  console.log('>>>>>>>>>>>>>> server > app.use async (req, res) <<<<<<<<<<<<<<<<<<<');
  if (__DEVELOPMENT__) {
    webpackIsomorphicTools.refresh();
  }

  const url = req.originalUrl || req.url;
  const location = parseUrl(url);
  const client = apiClient(req);
  const history = createMemoryHistory({ initialEntries: [url] });
  const store = createStore(history, client);

  //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > url: ', url);
  //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > location: ', location);
  //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > client: ', client);
  //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > history: ', history);
  //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > store: ', store);

  const hydrate = () => {
    res.write('<!doctype html>');
    ReactDOM.renderToNodeStream(<Html assets={webpackIsomorphicTools.assets()} store={store} />).pipe(res);
  };

  if (__DISABLE_SSR__) {
    return hydrate();
  }

  try {
    //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > try <<<<<<<<<<<<<<<<<<<');
    await loadOnServer({store, location, routes, helpers: { client }});

    const context = {};

    const component = (
      <Provider store={store} key="provider">
        <StaticRouter location={url} context={context}>
          <ReduxAsyncConnect routes={routes} helpers={{ client }} />
        </StaticRouter>
      </Provider>
    );

    //console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > try > component: ', component);

    const content = ReactDOM.renderToString(component);

    if (context.url) {
      return res.redirect(302, context.url);
    }

    const html = <Html assets={webpackIsomorphicTools.assets()} content={content} store={store} />;

    console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > try > html: ', html);

    res.status(200).send(`<!doctype html>${ReactDOM.renderToString(html)}`);

  } catch (error) {

    console.log('>>>>>>>>>>>>>> server > app.use async (req, res) > catch > error: ', error);

    if (error.name === 'RedirectError') {
      return res.redirect(VError.info(error).to);
    }
    res.status(500);
    hydrate();

  }
});

// #########################################################################

// app.use(pageNotFound);

// #########################################################################

/*
app.listen(config.port, (error) => {
  if (error) {
    console.log('>>>>>>>> Server Error: ', error);
  } else {
    console.log(`>>>>>>>> Server is running on port ${config.port} <<<<<<<<<<<`);
  }
});
*/

const normalizePort = (val)  => {

  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || config.port);
app.set('port', port);

// http.createServer([requestListener]): Returns a new instance of http.Server
// const server = https.createServer(options, app).listen(app.get('port'), '', () => {
const server = http.createServer(app).listen( app.get('port'), config.host, () => {
  console.log('>>>>>> Express server Connected: ', server.address());
});

server.on('error', (err) => {

  if (err.syscall !== 'listen') {
    console.log('>>>>>> Express server error: ', err);
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (err.code) {
    case 'EACCES':
      console.error('>>>>>> Express server error: ' + bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('>>>>>> Express server error: ' + bind + ' is already in use');
      process.exit(1);
      break;
    default:
      console.log('>>>>>> Express server error.code: ', err.code);
  }
});

server.on('listening', () => {

  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('>>>>>> Express server Listening on: ', bind);

});

//export default app;
