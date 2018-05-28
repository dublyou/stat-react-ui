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
  const { classes, data } = props;
  return (
  	<div style={{maxHeight: 600, overflowY: "scroll"}}>
  		{data.map((row) => <Article {...row}/>)}
	</div>
  );
}
class Articles extends React.Component {
	render() {
		const { classes } = this.props;
		let {articles } = this.props;
		articles = articles || {per_page: 5, width: 800};
		if (articles.dataurl === undefined) {
			articles.data = articles.data || sample_data;
		}
		return (
			<Paper>
				<Paginate component={articleList} {...articles}/>
			</Paper>
		)
	}
}

export default withStyles(styles)(Articles);