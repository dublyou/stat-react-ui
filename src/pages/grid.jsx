import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Articles from '../components/articles';
import CardList from '../components/cardList';
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
  const { type, args } = props;
  switch(type) {
  	case "articles":
  		return <Articles {...args}/>;
  	case "card_list":
  		return <CardList {...args}/>;
  	default:
  		return <p>Error: Item type does not exist</p>
  }
}
class GridPage extends React.Component {
	render() {
		const { classes, grid_items } = this.props;
		let gridItems = grid_items.map((item, key) => <Grid key={key} className={classes.gridItem} item {...item.sizes}>{getItem(item)}</Grid>);
		return (
			<Grid container spacing={8} className={classes.root}>
		        {gridItems}
		    </Grid>
		)
	}
}

export default withStyles(styles)(GridPage);