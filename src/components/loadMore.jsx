import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const styles = theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
  },
  content: {
    overflowY: 'auto',
    flex: "1 1 auto",
    "&::-webkit-scrollbar": {
      background: "transparent",
      width: 5,
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#fff",
      display: "block"
    }
  }
});

class LoadMore extends React.Component {
  constructor(props) {
    super(props);
    this.content = React.createRef();
  }
  state = {
    page: 1,
    data: [],
  }

  componentWillMount() {
    let { data, url } = this.props;
    if (url !== undefined) {
        axios.get(url).then(res => {
            return res.data;
        }).catch(error => {
          if (data !== undefined) {
            return data;
          }
          return [];
        }).then(val => {
            this.setState({data: val});
        });
    }
  }

  updatePage() {
    this.setState({
      page: this.state.page + 1,
    });
  }

  getPageContent(value, data) {
    let { component, component_args, per_page } = this.props;
    component_args = component_args || {};
    if (data !== undefined) {
      component_args.data = data.slice(0, value * per_page);
    }
    return component(component_args);
  }

  render() {
    const { classes } = this.props;
    let { page, data } = this.state;
    return (
      <div className={classes.root}>
        <div key="paginated-content" className={classes.content} ref={this.content}>{this.getPageContent(page, data)}</div>
        <Button color="primary" onClick={this.updatePage.bind(this)}>Load&nbsp;More</Button>
      </div>
    );
  }
}

export default withStyles(styles)(LoadMore);