import axios from 'axios';
import config from '../config';

// axios: Promise based HTTP client for the browser and node.js
// Requests can be made by passing the relevant config to axios

export default function apiClient(req) {
  // create a new instance of axios and set config defaults
  const instance = axios.create({
    baseURL: __SERVER__ ? `http://${config.apiHost}:${config.apiPort}` : '/api'
  });

  let token;

  // set jwt token for axios instance
  instance.setJwtToken = newToken => {
    token = newToken;
  };

  // interceptors: intercept requests or responses before they are handled by then or catch

  // Add a request interceptor
  instance.interceptors.request.use(
    conf => {
      // Do something before request is sent
      if (__SERVER__) {
        if (req.header('cookie')) {
          conf.headers.Cookie = req.header('cookie');
        }
        if (req.header('authorization')) {
          conf.headers.authorization = token || req.header('authorization') || '';
        }
      }
      return conf;
    },
    // Do something with request error
    error => Promise.reject(error)
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    // Do something with response data
    response => response.data,
    // Do something with response error
    error => Promise.reject(error.response ? error.response.data : error)
  );

  return instance;
}
