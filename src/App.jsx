import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import Profile from './pages/profile';
import Navbar from './components/navbar';
import logo from './logo.svg';
import './App.css';

const rootEl = document.getElementById('root');
const args = rootEl.getAttribute("data-args");

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    "primary": {
        "light": "#7986cb",
        "main": "#ff9999",
        "dark": "#303f9f",
        "contrastText": "#fff"
    },
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar></Navbar>
        <Profile {...args}></Profile>
      </MuiThemeProvider>
    );
  }
}

export default App;