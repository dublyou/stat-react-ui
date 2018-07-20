import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  card: {
    display: 'flex',
  },
  content: {
    padding: 10,
    "&:last-child": {
      paddingBottom: 10
    }
  }
});

function cardHeader(props) {
  const { classes } = props;
  return (
  	<CardHeader key={index} {...this.props}/>
  );
}

function cardMedia(props, index) {
  const { classes } = props;
  return (
  	<CardMedia key={index} {...props}/>
  );
}

function cardAvatar(props, index) {
  const { classes, size, image, title } = props;
  const styles = {height: size || "4rem", weight: size || "4rem"};
  return (
    <Avatar key={title} style={styles} title={title} src={image} />
  );
}

function typography(props, index) {
	const { content, text, hidden, ...other } = props;
  let inner;
	if (text === undefined) {
		inner = <Typography key={index}  {...other}/>;
	}
	inner = <Typography key={index} {...other}>{text}</Typography>;
  if (hidden !== undefined) {
    let args = {};
    args[hidden] = true;
    return <Hidden key={`hidden-${index}`} {...args}>{inner}</Hidden>;
  }
  return inner;
}

function cardContent(props, index) {
	const { classes, items } = props;
	return (
		<CardContent key={index} className={classes.content}>
			{items.map((props, i) => typography(props, i))}
    </CardContent>
	);
}

const cardFunctions = {
	header: cardHeader,
  avatar: cardAvatar,
	media: cardMedia,
	content: cardContent,
};

class CustomCard extends React.Component {
	render() {
		const { classes, content, styles } = this.props;

		return (
			<Card className={classes.card} style={styles}>
				{content.map((props, index) => {
          props["classes"] = classes;
          return cardFunctions[props.type](props, index);
        })}
	    </Card>
		);
	}
}

export default withStyles(styles)(CustomCard);
