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
  	borderRadius: 0,
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
  	maxWidth: 150,
  	width: "100%"
  },
});

function getHeaderContent(props) {
	let { classes, heading, type, image, details, accordion, cards } = props;
	let content = [];
	let subcontent = [];
	type = type || "single";
	switch(type) {
		case "single":
			if (heading) {
				content.push(<Typography variant="headline">{heading}</Typography>);
			}
			let subcontent = [];
			if (image) {
				subcontent.push(<div className={classes.container}><img className={classes.image} src={image} alt={name}/></div>);
			}
			if (details) {
				subcontent.push(<DetailList key={2} items={details}/>);
			}
			if (accordion) {
				subcontent.push(<Accordion expands={accordion}/>);
			}
			content.push(<Card className={classes.card}>{subcontent}</Card>);
			break;
		case "cards":
			content = cards.map((card, index) => <CustomCard index={index} {...card}/>);
			break;
	}
	return content;
}

class ProfileHeader extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root} elevation={2}>
				{getHeaderContent(this.props)}
			</Paper>
		);
	}
}

export default withStyles(styles)(ProfileHeader);
