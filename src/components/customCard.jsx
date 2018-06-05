import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

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

function cardHeader(props) {
  const { classes } = props;
  return (
  	<CardHeader {...this.props}/>
  );
}

function cardMedia(props) {
  const { classes } = props;
  return (
  	<CardMedia {...props}/>
  );
}

function typography(props) {
	const { content, text } = props;
	if (text === undefined) {
		return <Typography {...props}/>;
	}
	return <Typography {...props}>{text}</Typography>;
}

function cardContent(props) {
	const { classes, children } = props;
	return (
		<CardContent>
			{children.map((props) => typography(props))}
    </CardContent>
	);
}

const cardFunctions = {
	header: cardHeader,
	media: cardMedia,
	content: cardContent,
};

class CustomCard extends React.Component {
	render() {
		const { classes, content } = this.props;

		return (
			<Card className={classes.card}>
				{content.map((props) => cardFunctions[props.type](props))}
	    	</Card>
		);
	}
}

export default withStyles(styles)(CustomCard);
