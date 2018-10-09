import React, { Component } from 'react';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import Profile from './pages/profile';
import Paper from '@material-ui/core/Paper';
import SimplePage from './pages/simple';
import GridPage from './pages/grid';
import Navbar from './components/navbar';
import './App.css';
import sample_args from './sample_data/player_profile';
/*draft, franchise_profile, team_profile, game_profile, player_profile, season_profile, standings, stats, 
season_stat_leaders, alltime_stat_leaders, stat_rankings, season_stat_rankings, franchise_stat_rankings, home, player_comparison
*/

const rootEl = document.getElementById('root');
let args = window.args;
if (args === undefined) {
  args = rootEl.getAttribute("data-args");
  if (args === "test") {
    args = sample_args;
  } else {
    args = JSON.parse(args);
  }
}

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    "primary": {
        "light": "#ff6666",
        "main": "#cc0000",
        "dark": "#800000",
        "contrastText": "#fff"
    },
  },
});

class App extends Component {
  getPage(page) {
    switch(page) {
      case "profile":
        return <Profile {...args}/>;
      case "grid":
        return <GridPage {...args}/>;
      case "comparison":
        return <SimplePage type="comparison" {...args}/>;
      default:
        return <SimplePage {...args}/>;
    }
  }
  render() {
    const { page, navbar } = args;

    return (
      <MuiThemeProvider theme={theme}>
        <Navbar {...navbar}></Navbar>
        <Paper style={{paddingTop: 70, minHeight: "calc(100% - 70px)"}}>{this.getPage(page)}</Paper>
      </MuiThemeProvider>
    );
  }
}

export default App;