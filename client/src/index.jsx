import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import 'babel-polyfill';

ReactDOM.render(
  <App currentSong="388484" />,
  document.getElementById('app')
);
