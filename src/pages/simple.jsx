import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import DataTable from '../components/dataTable';
import Paginate from '../components/paginate';
import ProfileHeader from '../components/profileHeader'

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    paddingLeft: "1.6rem",
  }
});

class SimplePage extends React.Component {
  getContent(props) {
    const { url, type, args } = props;
    let { data } = props;
    switch(type) {
      case "datatable": {
        return <DataTable url={url} data={data} {...args}></DataTable>;
      }
      default: 
        return null;
    }
  }

  render() {
    const { classes, heading, header } = this.props;
    let content = this.getContent(this.props);
    let head = (header === undefined) ? <Typography className={classes.heading} variant="headline">{heading}</Typography> : <ProfileHeader {...header}></ProfileHeader>;

    return (
      <div className={classes.root}>
        {head}
        <Paper>
        	{content}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SimplePage);