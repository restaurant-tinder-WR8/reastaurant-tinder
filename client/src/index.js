import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from 'react-router-dom';
import AppState from "./context/AppState";
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
ReactDOM.render(
  <React.StrictMode>
    <AppState>
      <HashRouter>
        <App />
      </HashRouter>
    </AppState>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
