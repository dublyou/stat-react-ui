import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Hidden from '@material-ui/core/Hidden';
import DetailList from './detailList';
import Accordion from './accordion';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CustomCard from './customCard';
import SimpleList from './simpleList';

const styles = theme => ({
  root: {
  	padding: 5,
  	borderRadius: 0,
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: {
  	width: "6rem",
   	height: "6rem",
  },
  cover: {
    width: "4rem",
    height: "4rem",
  },
  content: {
  	padding: 10,
  	"&:last-child": {
  		paddingBottom: 16
  	}
  },
  detailItem: {
  	textAlign: "right",
  }
});

function getHeaderContent(props) {
	let { classes, heading, type, image, details, accordion, cards } = props;
	let content = [];
	let subcontent = [];
	type = type || "single";
	switch(type) {
		case "cards":
			content = cards.map((card, index) => <CustomCard index={index} {...card}/>);
			break;
		default:
			if (heading !== undefined && heading !== null) {
				content.push(<Typography variant="headline">{heading}</Typography>);
			}
			if (cards !== undefined && cards !== null) {
				content = content.concat(cards.map((card, index) => <CustomCard index={index} {...card}/>));
			}
			if (image !== undefined && image !== null) {
				subcontent.push(<CardMedia className={classes.image} image={image} title={heading || "image"}/>);
			}
			if (details !== undefined && details !== null) {
				let labels = Object.keys(details);
				const increment = 5;
				let count = Math.ceil(labels.length / increment)
				for (let i = 0; i < count; i++) {
					let items = labels.slice(i * increment, (i + 1) * increment).map(value => {
						let item = details[value];
						item["label"] = value;
						return item;
					});
					subcontent.push(<SimpleList key={i} items={items} styles={classes.detailItem} dense={true}/>);
				}
			}
			if (accordion !== undefined && accordion !== null) {
				subcontent.push(<Accordion expands={accordion}/>);
			}
			content.push(<Card className={classes.card}>{subcontent}</Card>);
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
