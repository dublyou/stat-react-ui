import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Paginate from '../components/paginate';
import Articles from '../components/articles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import SimpleList from '..components/simpleList';

const styles = theme => ({
  root: {
    width: '100%',
  },
});

function getItem(props) {
  const { classes, type, args } = props;

  switch(type) {
  	case "articles":
  		return <Articles {...args}/>;
  	case "card_list":
  		return (
  			<Card>
  				<CardHeader title={args.title}/>
  				<CardContent>
  					<SimpleList {...args}/>
  				</CardContent>
  			</Card>
  		);
  }
}
class GridPage extends React.Component {
	render() {
		const { classes, grid_items } = this.props;
		let default_size = 12 / grid_items.length;
		let gridItems = grid_items.map((item) => <Grid item xs={item.size}>{getItem(item)}</Grid>);
		return (
			<Grid container spacing={12}>
		        {gridItems}
		    </Grid>
		)
	}
}

export default withStyles(styles)(GridPage);