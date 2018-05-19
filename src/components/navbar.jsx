import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SimpleMenu from './menu';
import SideNav from './sidenav';
import SearchBox from './searchBox';


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class NavBar extends React.Component {
  state = {
    anchorEl: null,
    left: false,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = (open) => () => {
    if (open === undefined) {
      this.setState({
        left: !this.state.left,
      });
    } else {
      this.setState({
        left: open,
      });
    }
    
  };

  render() {
    const { classes, links , children, search} = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton onClick={this.toggleDrawer().bind(this)} className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Statdive
          </Typography>
          <SearchBox url={ search }/>
          <div>
            <SimpleMenu></SimpleMenu>
          </div>
        </Toolbar>
        <SideNav toggle={this.toggleDrawer(false).bind(this)} open={this.state.left}></SideNav>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);