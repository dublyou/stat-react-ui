import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DataTable from '../components/dataTable';
import Comparison from '../components/objectComparison';
import ProfileHeader from '../components/profileHeader';

const styles = theme => ({
  root: {
    
  },
  heading: {
    paddingLeft: "1.6rem",
  }
});

class SimplePage extends React.Component {
  getContent(props) {
    const { type, ...other } = props;
    switch(type) {
      case 'datatable': {
        return <DataTable {...other}></DataTable>;
      }
      case 'comparison': {
        return <Comparison {...other}></Comparison>;
      }
      default: 
        return null;
    }
  }

  render() {
    const { classes, heading, header, ...other } = this.props;
    let content = this.getContent(other);
    let head = (header === undefined) ? <Typography className={classes.heading} variant='headline'>{heading}</Typography> : <ProfileHeader {...header}></ProfileHeader>;

    return (
      <div className={classes.root}>
        {head}
        {content}
      </div>
    );
  }
}

export default withStyles(styles)(SimplePage);