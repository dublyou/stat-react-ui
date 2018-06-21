import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Articles from '../components/articles';
import Headlines from '../components/headlines';
import CardList from '../components/cardList';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    
  },
  gridItem: {
  	
  },
  heading: {
    padding: 10,
  }
});

function getItem(props) {
  const { type, args, ...other } = props;
  switch(type) {
  	case "articles":
  		return <Articles {...args}/>;
  	case "card_list":
  		return <CardList {...args} {...other}/>;
    case "headlines":
      return <Headlines {...args}/>;
  	default:
  		return <p>Error: Item type does not exist</p>
  }
}
class GridPage extends React.Component {
	render() {
		const { classes, grid_items, heading } = this.props;
		let gridItems = grid_items.map((item, key) => {
      let gridItem = getItem(item);
      if (item.sizes.xs === undefined) {
        gridItem = <Hidden xsDown>{gridItem}</Hidden>;
      }
      return <Grid key={key} className={classes.gridItem} {...item.sizes}>{gridItem}</Grid>;
    });
    const h1 = (heading === undefined) ? null : <Paper className={classes.heading}><Typography variant="headline">{heading}</Typography></Paper>;
		return (
      <div>
        {h1}
  			<Grid container justify="center" spacing={8} className={classes.root}>
  		      {gridItems}
  		  </Grid>
      </div>
		)
	}
}

export default withStyles(styles)(GridPage);