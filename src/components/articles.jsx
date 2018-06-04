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
    margin: 5,
    width: "100%",
    height: "100%"
  }
});

function articleList(props) {
  const { data } = props;
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
		if (data === undefined) {
			data = data || sample_data;
		}
		return (
			<Paper className={classes.root}>
				<Paginate component={articleList} {...{url, data, per_page, width}}/>
			</Paper>
		)
	}
}

export default withStyles(styles)(Articles);