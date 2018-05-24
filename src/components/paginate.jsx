import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';

const styles = theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  children: {
    margin: "auto",
  },
});

class PageButton extends React.Component {
  handleClick = () => {
    this.props.updatePage(this.props.value);
  }
  render() {
    const { value, color, label } = this.props;
    return <Button color={color} onClick={this.handleClick}>{label || value}</Button>;
  }
}

class Paginate extends React.Component {
  constructor(props) {
    super(props);
    let { data, dataurl, per_page } = props;
    let filter_url = false;
    if (dataurl !== undefined) {
      const url_regex = /\[=[\w\d\-]+=\]/;
      if (filter_url.test(dataurl)) {
        data = [];
        filter_url = true;
      } else {
        axios.get(dataurl).then(res => {
            data = res.data;
        });
      }
    } 
    this.state = {
      data: data,
      page: 1,
      filter_url: filter_url,
    };
  }

  getData(filters, sort) {
    const { dataurl, per_page } = this.props;
    let { data, filter_url } = this.state;
    if (filter_url) {
        for (let f in filters) {
            url = url.replace("[=" + f + "=]", filters[f]);
        }
    }
    if (dataurl !== undefined) {
      axios.get(dataurl).then(res => {
          data = res.data;
      });
    }
    if (sort !== undefined) {
      data = data.sort(sort);
    }
    this.setState({
      data: data,
      page: 1,
    });
    return data.slice(0, per_page);
  }

  updatePage(value) {
    this.setState({
      page: value,
    });
  }

  getPageContent(value, data) {
    let { component, component_args, per_page } = this.props;
    let start = (value - 1) * per_page;
    let end = start + per_page;
    component_args = component_args || {};
    component_args.data = data.slice(start, end);
    component_args.getData = this.getData.bind(this);
    component_args.paginated = true;
    return component(component_args);
  }

  get_page_btns(current_page, data) {
    const { per_page } = this.props;
    const pages = Math.ceil(data.length / per_page);
    let page_buttons = [(current_page == 1) ? <Button color="primary">1</Button> : <PageButton color="secondary" value={1} updatePage={this.updatePage.bind(this)}/>];
    const btns_displayed = 10;
    let start = 2;
    let end = pages - 1;

    if (pages > btns_displayed) {
      let range = Math.ceil((btns_displayed/2) - 2);
      start = current_page - range;
      end = current_page + range;
      if (end > pages) {
        start += pages - end;
        end = pages;
      } else if (start < 2) {
        end += 2 - start;
        start = 2;
      }
      if (start > 2) {
        page_buttons.push(<Button>...</Button>);
      }
    }
    for (let p = start; p <= end; p++) {
      if (p == current_page) {
        page_buttons.push(<Button color="primary">{p}</Button>);
      } else {
        page_buttons.push(<PageButton color="secondary" value={p} updatePage={this.updatePage.bind(this)}/>);
      }
    }
    /* add ellipsis if there is a number gap between last button and second to last button*/
    if (end > pages - 1) {
      page_buttons.push(<Button>...</Button>);
    }
    page_buttons.push((current_page == pages) ? <Button color="primary">{pages}</Button> : <PageButton color="secondary" value={pages} updatePage={this.updatePage.bind(this)}/>);
    /* add prev button if current page is greater than 1 */
    if (current_page > 1) {
      page_buttons.unshift(<PageButton color="primary" label="Prev" value={current_page - 1} updatePage={this.updatePage.bind(this)}/>);
    }
    /* add next button if current page is less than the total number of pages*/
    if (current_page < pages) {
      page_buttons.push(<PageButton color="primary" label="Next" value={current_page + 1} updatePage={this.updatePage.bind(this)}/>);
    }
    return page_buttons;
  }

  render() {
    const { classes} = this.props;
    let { page, data } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.children}>{this.getPageContent(page, data)}</div>
        <div className={classes.children}>{this.get_page_btns(page, data)}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Paginate);