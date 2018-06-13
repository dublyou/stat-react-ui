import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Articles from '../components/articles';
import Headlines from '../components/headlines';
import CardList from '../components/cardList';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    width: '100%',
  },
  gridItem: {
  	
  },
  heading: {
    padding: 10,
  }
});

function getItem(props) {
  const { type, args } = props;
  switch(type) {
  	case "articles":
  		return <Articles {...args}/>;
  	case "card_list":
  		return <CardList {...args}/>;
    case "headlines":
      return <Headlines {...args}/>;
  	default:
  		return <p>Error: Item type does not exist</p>
  }
}
class GridPage extends React.Component {
	render() {
		const { classes, grid_items, heading } = this.props;
		let gridItems = grid_items.map((item, key) => <Grid key={key} className={classes.gridItem} item {...item.sizes}>{getItem(item)}</Grid>);
    const h1 = (heading === undefined) ? null : <Paper className={classes.heading}><Typography variant="headline">{heading}</Typography></Paper>;
		return (
      <div>
        {h1}
  			<Grid container spacing={8} className={classes.root}>
  		      {gridItems}
  		  </Grid>
      </div>
		)
	}
}

export default withStyles(styles)(GridPage);