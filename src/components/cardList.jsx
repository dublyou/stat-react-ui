import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import SimpleList from '../components/simpleList';

const styles = theme => ({
  root: {
  	margin: 5,
  },
  cardHeader: {
    borderBottom: "1px solid #fff"
  },
  headerRoot: {
  	padding: 5,
  	textAlign: "center",
  },
  headerTitle: {
    fontSize: 16,
  },
  cardContent: {
  	padding: 5,
  }
});

class CardList extends React.Component {
	render() {
		const { classes, title, footer, ...args } = this.props;
    const cardFooter = (footer === undefined) ? null : <CardActions><Button {...footer.props} component="a">{footer.label}</Button></CardActions>;
          
		return (
  			<Card className={classes.root}>
  				<CardHeader className={classes.cardHeader} classes={{root: classes.headerRoot, title: classes.headerTitle}} title={title}/>
  				<CardContent className={classes.cardContent}>
  					<SimpleList {...args}/>
  				</CardContent>
          {cardFooter}
  			</Card>
		);
	}
}

export default withStyles(styles)(CardList);
