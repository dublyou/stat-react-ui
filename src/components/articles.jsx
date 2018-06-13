import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Paginate from '../components/paginate';
import LoadMore from '../components/loadMore';
import Article from '../components/article';
import sample_articles from '../sample_data/news_data';

const styles = theme => ({
  root: {
    margin: 5,
    width: "100%",
    height: "100%"
  }
});

function articleList(props) {
  let { data } = props;
  return (
  	<div>
  		{data.map((row, key) => <Article key={key} {...row}/>)}
	</div>
  );
}
class Articles extends React.Component {
	render() {
		const { classes, url } = this.props;
		let { per_page, width, data } = this.props;
		per_page = per_page || 5;
		width = width || 400;
		data = data || sample_articles;
		return (
			<Paper className={classes.root}>
				<LoadMore component={articleList} {...{url, data, per_page, width}}/>
			</Paper>
		)
	}
}

export default withStyles(styles)(Articles);