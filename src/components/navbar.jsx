import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SimpleMenu from './menu';
import SideNav from './sidenav';
import SearchBar from './searchBar';
import SearchSelect from './searchSelect';
import SimpleList from './simpleList';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    marginLeft: ".5rem",
  },
  title: {
    textDecoration: "none",
    display: "inline-block",
    color: theme.palette.primary.main,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    minWidth: 250,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.grey[900],
  },
  listItems: {
    fontSize: "1.2rem",
  },
  sectionTitle: {
    padding: ".5rem",
    textAlign: "center"
  },
  searchBar: {
    position: "absolute",
    bottom: -50,
    left: 0,
    width: "100%",
    textAlign: "center",
  },
  searchBarContainer: {
    display: "inline-block",
    backgroundColor: theme.palette.grey[900],
    opacity: .9,
    padding: ".5rem",
    position: "relative",
    boxShadow: theme.shadows[2]
  },
  hideSearchButton: {
    position: "absolute",
    top: "-1rem",
    right: "-1rem",
    backgroundColor: theme.palette.background.default,
    height: "2rem",
    width: "2rem",
  },
  closeIcon: {
    fontSize: "inherit"
  }
});

class NavBar extends React.Component {
  state = {
    anchorEl: null,
    left: false,
    showSearch: false,
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

  toggleSearch = (show) => () => {
    show = (show === undefined) ? !this.state.showSearch : show;
    this.setState({showSearch: show});
  };

  render() {
    const { classes, search_bar, title, side_nav, resources } = this.props;
    let searchBar = null;
    let searchBarContainer = null;
    if (search_bar !== undefined) {
      const { type, searches } = search_bar
      searchBar = (type === "select" ? <SearchSelect searches={searches}/> : <SearchBar search_bar={search_bar}/>);
    }
    if (this.state.showSearch) {
      searchBarContainer = (
        <div className={classes.searchBar}>
          <span className={classes.searchBarContainer}>
            {searchBar}
            <IconButton className={classes.hideSearchButton} onClick={this.toggleSearch(false)} color="inherit" aria-label="hideSearch">
              <CloseIcon fontSize="inherit" classes={{root: classes.closeIcon}}/>
            </IconButton>
          </span>
        </div>
      );
    }
    
    return (
      <AppBar position="fixed" color="default">
        <Toolbar>
          <IconButton onClick={this.toggleDrawer().bind(this)} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <div className={classes.container}>
            <Typography component="a" href="/" variant="title" color="inherit" className={classes.title}>
              {title || "Statdive"}
            </Typography>
          </div>
          <Hidden xsDown>{searchBar}</Hidden>
          <Hidden smUp>
            <IconButton onClick={this.toggleSearch()} color="inherit" aria-label="Search">
              <SearchIcon />
            </IconButton>
          </Hidden>
          {searchBarContainer}
        </Toolbar>
        <SideNav toggle={this.toggleDrawer(false).bind(this)} open={this.state.left}>
          <div className={classes.drawerHeader}>
            <div className={classes.container} style={{marginLeft: 10}}>
              <Typography component="a" href="/" variant="title" color="inherit" className={classes.title}>
                {title || "Statdive"}
              </Typography>
              </div>
            <IconButton onClick={this.toggleDrawer(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.list}>
            <SimpleList component="a" styles={classes.listItems} items={side_nav}/>
          </div>
          <Divider />
          <Typography className={classes.sectionTitle} variant="title">Resources</Typography>
          <SimpleList {...resources}/>
        </SideNav>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);