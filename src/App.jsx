import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import Profile from './pages/profile';
import Articles from './pages/articles';
import Navbar from './components/navbar';
import logo from './logo.svg';
import './App.css';

const rootEl = document.getElementById('root');
const args = JSON.parse(rootEl.getAttribute("data-args"));

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
  get_page(page) {
    switch(page) {
      case "profile":
        return <Profile {...args}/>;
      case "articles":
        return <Articles {...args}/>;
    }
  }
  render() {
    const { page } = args;
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar {...args.navbar}></Navbar>
        {this.get_page(page)}
      </MuiThemeProvider>
    );
  }
}

export default App;