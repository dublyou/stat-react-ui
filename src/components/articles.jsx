import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Paginate from '../components/paginate';
import Article from '../components/article';
import sample_articles from '../sample_data/articles';

const sample_data = sample_articles.articles;
const styles = theme => ({
  root: {
    width: '100%',
  },
  articles: {
    maxHeight: 400,
  },
});

function articleList(props) {
  const { data } = props;
  return (
  	<div style={{maxHeight: 550, overflowY: "scroll"}}>
  		{data.map((row) => <Article {...row}/>)}
	</div>
  );
}
class Articles extends React.Component {
	render() {
		const { classes, url } = this.props;
		let { per_page, width, data } = this.props;
		per_page = per_page || 5;
		width = width || 400;
		if (url === undefined) {
			data = data || sample_data;
		}
		return (
			<Paper>
				<Paginate component={articleList} {...{url, data, per_page, width}}/>
			</Paper>
		)
	}
}

export default withStyles(styles)(Articles);