import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

data = [
{"authors": ["Dionysis Aravantinos"], "description": null, "image_url": "https://www.eurohoops.net/wp-content/uploads/2018/05/doncic_real_cska-600x314.jpg", "keywords": null, "publish_date": "2018/05/18 11:12 PM", "source": "eurohoops.net/en/euroleague/678699/luka-doncic-with-the-best-u-20-performance-in-final-four-history/?utm_campaign=Echobox&utm_medium=Social&utm_source=Twitter", "summary": "", "title": "Luka Doncic with the best U-20 performance in Final Four history", "url": "https://www.eurohoops.net/en/euroleague/678699/luka-doncic-with-the-best-u-20-performance-in-final-four-history/?utm_campaign=Echobox&utm_medium=Social&utm_source=Twitter"}, 
{"authors": [], "description": "Kansas City seems to have joined Seattle on the short list for an NBA expansion team.", "image_url": "https://s.yimg.com/ny/api/res/1.2/krXvTdG7o03_wbU7BNh65w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyODA7aD02NjguOA--/https://s.yimg.com/uu/api/res/1.2/7Cy29VY9XUQA8VbsG2mbIw--~B/aD0yNDkyO3c9NDc2ODtzbT0xO2FwcGlkPXl0YWNoeW9u/http://media.zenfs.com/en/homerun/feed_manager_auto_publish_494/d754af9cf1aa487abf5c720e6b74bf4f", "keywords": null, "publish_date": "2018/05/18 10:30 PM", "source": "sports.yahoo.com/nba-executive-kansas-city-will-get-nba-team-point-233932993.html", "summary": "", "title": "NBA executive: Kansas City will get NBA team 'at some point'", "url": "https://sports.yahoo.com/nba-executive-kansas-city-will-get-nba-team-point-233932993.html"}, 
{"authors": ["Dave Mcmenamin", "Nick Depaula"], "description": "Phoenix Suns general manager Ryan McDonough says he hasn't ruled out the option of dealing away the No. 1 pick in June's draft for a lower pick -- or even a worthy veteran player.", "image_url": "http://a4.espncdn.com/combiner/i?img=%2Fphoto%2F2018%2F0515%2Fr371108_1296x729_16%2D9.jpg", "keywords": "trade, no. 1 pick, top pick, gm, general manager, ryan mcdonough, nba draft lottery, marvin bagley iii, NBA, NBA Draft, DeAndre Ayton, Luka Doncic, Phoenix Suns, Atlanta Hawks, Sacramento Kings", "publish_date": "2018/05/18 08:15 PM", "source": "espn.com/nba/story/_/id/23540668/phoenix-suns-general-manager-ryan-mcdonough-certainly-open-dealing-no-1-pick", "summary": "", "title": "Phoenix Suns general manager Ryan McDonough 'certainly open' to dealing No. 1 pick", "url": "http://www.espn.com/nba/story/_/id/23540668/phoenix-suns-general-manager-ryan-mcdonough-certainly-open-dealing-no-1-pick"},
];

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
  state = {
    page: 1,
    data: [],
    page_data: [],
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
    const { classes, Component, data, dataurl, per_page } = this.props;
    let { component_args } = this.props;
    if (dataurl) {
      axios.get(dataurl).then(res => {
          this.setState({data: res.data});
      });
    } else {
      this.setState({data: data});
    }
    let start = (this.state.page - 1) * per_page;
    let end = start + per_page;
    this.setState({page_data: this.state.data.slice(start, end)})
    const pages = Math.ceil(this.state.data.length / per_page)
    return (
      <div>
        <Component data={this.state.page_data} {...component_args}/>
        <div>{this.get_page_btns()}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Paginate);