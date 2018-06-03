import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
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

class tabContent extends React.Component {

}

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
    let { url, type, args } = tabs[value];
    args = args || {};
    let { data } = args;
    if (url && data === undefined) {
      axios.get(url).then(res => {
          args.data = res.data;
      });
    }
    switch(type) {
      case "datatable": {
        args.dataurl = url;
        const { paginate } = args;
        if (paginate) {
          const { per_page } = args;
          const datatable = (props) => { return <DataTable {...props}/>; };
          return <Paper key={value}><Paginate per_page={per_page} component={datatable} component_args={args}/></Paper>;
        } else {
          return <Paper key={value}><DataTable {...args}/></Paper>;
        }
      }
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

