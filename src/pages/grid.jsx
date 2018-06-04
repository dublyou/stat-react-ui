import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Articles from '../components/articles';
import CardList from '../components/cardList';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    width: '100%',
    height: '90%'
  },
  gridItem: {
  	height: "100%",
  }
});

function getItem(props) {
  const { classes, type, args } = props;
  switch(type) {
  	case "articles":
  		return <Articles {...args}/>;
  	case "card_list":
  		return <CardList {...args}/>;
  }
}
class GridPage extends React.Component {
	render() {
		const { classes, grid_items } = this.props;
		let default_size = 12 / grid_items.length;
		let gridItems = grid_items.map((item, key) => <Grid key={key} className={classes.gridItem} item {...item.sizes}>{getItem(item)}</Grid>);
		return (
			<Grid container spacing={8} className={classes.root}>
		        {gridItems}
		    </Grid>
		)
	}
}

export default withStyles(styles)(GridPage);