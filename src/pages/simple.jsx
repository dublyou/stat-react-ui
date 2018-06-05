import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DataTable from '../components/dataTable';
import Paginate from '../components/paginate';
import axios from 'axios';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class SimplePage extends React.Component {
  getContent(props) {
    const { url, type, args } = props;
    let { data } = props;
    if (url) {
      axios.get(url).then(res => {
          data = res.data;
      });
    }
    switch(type) {
      case "datatable": {
        const { paginate } = args;
        if (paginate) {
          const { per_page } = args;
          const datatable = (props) => { return <DataTable {...props}/>;};
          return <Paginate per_page={per_page} component={datatable} component_args={args}/>;
        }
        return <DataTable data={data} {...args}></DataTable>;
      }
      default: 
        return "";
    }
  }

  render() {
    const { classes, heading } = this.props;
    let content = this.getContent(this.props);

    return (
      <div className={classes.root}>
        <Typography variant="headline">{heading}</Typography>
        <Paper>
        	{content}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SimplePage);