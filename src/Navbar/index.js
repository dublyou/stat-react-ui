import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SideBar from './components/SideBar';
import SearchBar from './components/SearchBar';
import SimpleList from '../components/simpleList';
import { sideBarItems, sideBarResources } from './helpers';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    textDecoration: "none",
    display: "inline-block",
    marginLeft: ".5rem"
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
    backgroundColor: '#212121',
    height: 65
  },
  listItems: {
    fontSize: "1.2rem",
  },
  transitionContainer: {
    width: '100%', 
    display: 'flex', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  searchBar: {
    position: "absolute",
    bottom: -50,
    left: 0,
    width: "100%",
    textAlign: "center",
  },
  searchBarContainer: {
    transition: 'width .4s',
    display: 'flex',
    justifyContent: 'flex-end',
    maxWidth: 400,
  },
  sectionTitle: {
    margin: `0 ${theme.spacing.unit}px`,
  }
});

class NavBar extends React.Component {
  state = {
    anchorEl: null,
    openSideBar: false,
    showSearch: false,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  toggleDrawer = (open) => () => {
    this.setState((state) => ({openSideBar: (open === undefined) ? !state.openSideBar : open}));
  };

  toggleSearch = (show) => () => {
    this.setState((state) => ({showSearch: (show === undefined) ? !state.showSearch : show}));
  };

  render() {
    const { classes, title } = this.props;
    const { showSearch, openSideBar } = this.state;
    
    return (
      <AppBar position="fixed" color="default">
        <Toolbar>
            <IconButton onClick={this.toggleDrawer()} color="inherit" aria-label="Menu">
                <MenuIcon />
            </IconButton>
            <div className={classes.transitionContainer}>
                <Hidden xsDown={showSearch}>
                    <div style={{flex: 1}}>
                        <Typography component="a" href="/" variant="h6" color="primary" className={classes.title}>
                            {title || "Statdive"}
                        </Typography>
                    </div>
                </Hidden>
                <div className={classes.searchBarContainer} style={{width: showSearch ? '100%' : 0, overflow: showSearch ? 'visible': 'hidden'}}>
                    <SearchBar/>
                </div>
            </div>
            <IconButton onClick={this.toggleSearch()} color="inherit" aria-label="Search">
                <SearchIcon />
            </IconButton>
        </Toolbar>
        <SideBar toggle={this.toggleDrawer(false)} open={openSideBar}>
          <div className={classes.drawerHeader}>
            <div style={{flex: 1}}>
                <Typography component="a" href="/" variant="h6" color="primary" className={classes.title}>
                    {title || "Statdive"}
                </Typography>
            </div>
            <IconButton onClick={this.toggleDrawer(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.list}>
            <SimpleList component="a" styles={classes.listItems} items={sideBarItems}/>
          </div>
          <Divider />
          <Typography className={classes.sectionTitle} variant="h6">Resources</Typography>
          <SimpleList {...sideBarResources}/>
        </SideBar>
      </AppBar>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);