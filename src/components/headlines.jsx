import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CardList from '../components/cardList';
import axios from 'axios';
import sample_articles from '../sample_data/news_data';


const styles = theme => ({
  
});

class Headlines extends React.Component {
  state = {
    data: [],
  }
  componentWillMount() {
    let { data, url } = this.props;
    if (url !== undefined) {
        axios.get(url).then(res => {
            return res.data;
        }).catch(error => {
          return data || sample_articles;
        }).then(val => {
            this.setState({data: val});
        });
    }
  }

  render() {
    const { count } = this.props;
    const { data } = this.state;
    let items = data.slice(0, count || 10).map((value) => ({primary: value.title, props: {href: value.url, target: "_blank", title: value.description}}));

    return (
      <CardList title="Headlines" component="a" items={items}/>
    );
  }
}

export default withStyles(styles)(Headlines);