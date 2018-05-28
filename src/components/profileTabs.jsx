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


const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

const testTabs = [
  {label: "Averages", type: "datatable", url: "http://statdive.com/stats/averages/player-season-team/player=1211/", args: {}},
  {label: "Totals", type: "datatable", url: "http://statdive.com/stats/averages/player-season-team/player=1211/", args: {}},
]

class ProfileTabs extends React.Component {
  state = {
    value: 0
  }

  tabContent = {}

  handleChange(event, value) {
    this.setState({ value });
  }

  getTab(value) {
    let tabContent = this.tabContent;
    if (tabContent.hasOwnProperty(value)) {
      return tabContent[value];
    }

    let tabs = this.props.tabs || testTabs;
    let tabProps = tabs[value];
    let data = [];
    if (tabProps.url) {
      axios.get(tabProps.url).then(res => {
          data = res.data;
      });
    }
    switch(tabProps.type) {
      case "datatable": {
        const { paginate } = tabProps.args;
        if (paginate) {
          const { per_page } = tabProps.args;
          const datatable = (props) => { return <DataTable {...props}/>;};
          tabContent[value] = <Paginate per_page={per_page} component={datatable} component_args={tabProps.args}/>
        }
        tabContent[value] = <DataTable data={data} {...tabProps.args}></DataTable>;
        return tabContent[value];
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    let { tabs } = this.props;
    tabs = tabs || testTabs;
    const tabList = tabs.map((value, index) => <Tab key={index} label={value.label} />);
    let currentTab = this.getTab(value);

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            scrollable
            scrollButtons="auto"
          >
            {tabList}
          </Tabs>
        </AppBar>
        <Paper>
        	{currentTab}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileTabs);

