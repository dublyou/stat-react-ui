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
import SearchBar from './searchBar';
import SearchSelect from './searchSelect';
import SimpleList from './simpleList';


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
  list: {
    width: 250,
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
    const { classes, search_bar, title, side_nav} = this.props;
    const { anchorEl } = this.state;
    let searchBar = null;
    if (search_bar !== undefined) {
      const { type, searches } = search_bar
      searchBar = (type === "select" ? <SearchSelect searches={searches}/> : <SearchBar search_bar={search_bar}/>);
    }
    
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <IconButton onClick={this.toggleDrawer().bind(this)} className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            {title || "Statdive"}
          </Typography>
          {searchBar}
        </Toolbar>
        <SideNav toggle={this.toggleDrawer(false).bind(this)} open={this.state.left}>
          <div className={classes.list}>
            <SimpleList component="a" items={side_nav}/>
          </div>
        </SideNav>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);