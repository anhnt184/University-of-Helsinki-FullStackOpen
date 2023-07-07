// import React from 'react'
// import ReactDOM from 'react-dom'

// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './Appmatch'


// ReactDOM.render(
//   <Router>
//     <App />
//   </Router>,
//   document.getElementById('root')
// )

// // ReactDOM.createRoot(document.getElementById('root')).render(<App />)

// // ReactDOM.createRoot(document.getElementById('root')).render(<Router><App /></Router>)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './Appmatch';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);