// React
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../public/guide.css';

import Email from './components/Email';

class App extends Component {

  render() {
    return (
      <div>
        <Email/>
      </div>
    );
  }
}

export default App;
