import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import SimpleList from '../components/simpleList';

const styles = theme => ({
  root: {
  	margin: 5,
  },
  cardHeader: {
  	padding: 5,
  	textAlign: "center",
  },
  cardContent: {
  	padding: 5,
  }
});

class CardList extends React.Component {
	render() {
		const { classes, title, ...args } = this.props;
		return (
  			<Card className={classes.root}>
  				<CardHeader className={classes.cardHeader} title={title}/>
  				<CardContent className={classes.cardContent}>
  					<SimpleList {...args}/>
  				</CardContent>
  			</Card>
		);
	}
}

export default withStyles(styles)(CardList);
