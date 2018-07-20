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

function getItem(type, args, other) {
  switch(type) {
  	case "articles":
  		return <Articles {...args}/>;
  	case "card_list":
  		return <CardList {...args} {...other}/>;
    case "headlines":
      return <Headlines {...args}/>;
    case "twitter":
      return <Paper style={{margin: ".5rem"}}><a class="twitter-timeline" data-theme="dark" data-link-color="#F5F8FA" href={args.href}>Tweets by {args.handle}</a></Paper>;
  	default:
  		return <p>Error: Item type does not exist</p>
  }
}
class GridPage extends React.Component {
	render() {
		const { classes, grid_items, heading } = this.props;
		let gridItems = grid_items.map((item, key) => {
      const { type, sizes, args, ...other} = item;
      let gridItem = getItem(type, args, other);
      if (sizes.xs === undefined) {
        gridItem = <Hidden xsDown>{gridItem}</Hidden>;
      }
      return <Grid item key={key} className={classes.gridItem} {...sizes}>{gridItem}</Grid>;
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