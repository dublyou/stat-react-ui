import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
});

class Paginate extends React.Component {
  constructor(props) {
    super(props);
    let { data, dataurl, per_page } = props;
    if (dataurl) {
      axios.get(dataurl).then(res => {
          data = res.data;
      });
    } 
    this.state = {
      data: data,
      page: 1,
      page_data: data.slice(0, per_page),
    };
  }

  updatePage(value) {
    const { per_page } = this.props;
    const data = this.state.data;
    let start = (value - 1) * per_page;
    let end = start + per_page;
    this.setState({
      page: value,
      page_date: data.slice(start, end)
    });
  }

  get_page_btns(pages, current_page) {
    let page_buttons = [(current_page == 1) ? <Button disabled color="primary">1</Button> : <Button color="secondary" onChange={this.updatePage(1)}>1</Button>]
    const btns_displayed = 10
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
        page_buttons.push(<Button disabled>...</Button>)
      }
    }
    for (let p = start; p <= end; p++) {
      if (p == current_page) {
        page_buttons.push(<Button disabled color="primary">{p}</Button>);
      } else {
        page_buttons.push(<Button color="secondary" onChange={this.updatePage(p)}>{p}</Button>);
      }
    }
    /* add ellipsis if there is a number gap between last button and second to last button*/
    if (end > pages - 1) {
      page_buttons.push(<Button disabled>...</Button>);
    }
    page_buttons.push((current_page == pages) ? <Button disabled color="primary">pages</Button> : <Button color="secondary" onChange={this.updatePage(pages)}>pages</Button>);
    /* add prev button if current page is greater than 1 */
    if (current_page > 1) {
      page_buttons.shift(<Button color="primary" onChange={this.updatePage(current_page - 1)}>Prev</Button>);
    }
    /* add next button if current page is less than the total number of pages*/
    if (current_page < pages) {
      page_buttons.shift(<Button color="primary" onChange={this.updatePage(current_page + 1)}>Next</Button>);
    }
    return page_buttons;
  }

  render() {
    const { classes, component, data, dataurl, per_page } = this.props;
    let { component_args } = this.props;
    component_args = component_args || {};
    component_args.data = this.state.page_data;
    
    const pages = Math.ceil(this.state.data.length / per_page)
    return (
      <div>
        {component(component_args)}
        <div>{this.get_page_btns(pages, this.state.page)}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Paginate);