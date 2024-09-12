import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This ensures that React works in all browsers, including IE11.
// You can remove these if you don't need to support older browsers.
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);