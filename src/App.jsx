import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import createMuiTheme from 'material-ui/styles/createMuiTheme';
import Profile from './pages/profile';
import Articles from './pages/articles';
import SimplePage from './pages/simple';
import GridPage from './pages/grid';
import Navbar from './components/navbar';
import logo from './logo.svg';
import './App.css';
import sample_args from './sample_data/home';
/*import { franchise_profile, team_profile, game_profile, player_profile, season_profile } from './sample_data';*/

const rootEl = document.getElementById('root');
let args = rootEl.getAttribute("data-args");
if (args) {
  args = JSON.parse(args);
} else {
  args = sample_args;
}

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
      case "simple":
        return <SimplePage {...args}/>;
      case "grid":
        return <GridPage {...args}/>;
    }
  }
  render() {
    const { page, navbar } = args;
    return (
      <MuiThemeProvider theme={theme}>
        <Navbar {...navbar}></Navbar>
        {this.get_page(page)}
      </MuiThemeProvider>
    );
  }
}

export default App;