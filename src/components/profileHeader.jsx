import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import DetailList from './detailList';
import Accordion from './accordion';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CustomCard from './customCard';

const styles = theme => ({
  root: {
  	padding: 5,
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: {
   	height: "auto",
   	minWidth: 100,
   	width: "100%"
  },
  container: {
  	maxWidth: 250,
  	width: "100%"
  },
});

function getHeaderContent(props) {
	const { classes, name, type, image, details, accordion, cards } = props;
	let content = [];
	let subcontent = [];

	switch(type) {
		case "single":
			if (name) {
				content.push(<Typography variant="headline">{name}</Typography>);
			}
			let subcontent = [];
			if (image) {
				subcontent.push(<div className={classes.container}><img className={classes.image} src={image} alt={name}/></div>);
			}
			if (details) {
				subcontent.push(<DetailList items={details}/>);
			}
			if (accordion) {
				subcontent.push(<Accordion expands={accordion}/>);
			}
			content.push(<Card className={classes.card}>{subcontent}</Card>);
			break;
		case "cards":
			content = cards.map((card) => <CustomCard {...card}/>);
			break;
	}
	return content;
}

class ProfileHeader extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root} elevation={4}>
				{getHeaderContent(this.props)}
			</Paper>
		);
	}
}

export default withStyles(styles)(ProfileHeader);
