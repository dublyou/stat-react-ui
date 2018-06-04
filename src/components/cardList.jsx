import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
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
