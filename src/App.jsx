import React, { Component } from 'react'
import Profile from './pages/profile';
import Paper from '@material-ui/core/Paper';
import SimplePage from './pages/simple';
import GridPage from './pages/grid';
import Navbar from './Navbar';

class App extends Component {
  state = {
    args: null
  }

  componentDidMount() {
    this.setState({args: window.args});
  }

  getPage(args) {
    const { page, ...other} = args;
    switch(page) {
      case "profile":
        return <Profile {...other}/>;
      case "grid":
        return <GridPage {...other}/>;
      case "comparison":
        return <SimplePage type="comparison" {...other}/>;
      default:
        return <SimplePage {...other}/>;
    }
  }

  render() {
    const { args } = this.state;
    if (args) {
      return (
        <React.Fragment>
          <Navbar/>
          <Paper 
            style={{
              paddingTop: 70, 
              minHeight: "calc(100% - 70px)"
            }}
          >
            {this.getPage(args)}
          </Paper>
        </React.Fragment>
      );
    }
    return null;
  }
}

export default App;