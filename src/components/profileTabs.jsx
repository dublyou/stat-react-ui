import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import DataTable from './dataTable';
import Paginate from './paginate';
import axios from 'axios';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class ProfileTabs extends React.Component {
  state = {
    value: 0
  };

  tabContent = {};

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getTab(value) {
    const { tabs } = this.props;
    let { type, url, args } = tabs[value];
    args = args || {};
    
    switch(type) {
      case "datatable": {
        return <Paper key={value}><DataTable url={url} {...args}/></Paper>;
      }
      default:
        return "";
    }
  }

  render() {
    const { classes, tabs } = this.props;
    const { value } = this.state;
    const tabList = tabs.map((tab, index) => <Tab key={index} label={tab.label}/>);

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {tabList}
          </Tabs>
        </AppBar>
        {this.getTab(value)}
      </div>
    );
  }
}

export default withStyles(styles)(ProfileTabs);

