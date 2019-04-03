import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
  },
});

class LoadMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      perPage: 5,
      data: [],
    }
  }

  updatePage = e => {
    this.setState((state) => ({page: state.page + 1}));
  }

  render() {
    const { classes, component, data } = this.props;
    const { page, perPage } = this.state;
    const Component = component;
    return (
      <div className={classes.root}>
        <div className={classes.content}>
          {data.slice(0, page * perPage).map((row, i) => <Component key={i} {...row}/>)}
        </div>
        <Button color="primary" onClick={this.updatePage}>Load&nbsp;More</Button>
      </div>
    );
  }
}

export default withStyles(styles)(LoadMore);