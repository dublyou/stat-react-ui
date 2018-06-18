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
  	<CardHeader {...this.props}/>
  );
}

function cardMedia(props) {
  const { classes } = props;
  return (
  	<CardMedia {...props}/>
  );
}

function cardAvatar(props) {
  const { classes, size, image, title } = props;
  const styles = {height: size || "4rem", weight: size || "4rem"};
  return (
    <Avatar style={styles} title={title} src={image} />
  );
}

function typography(props) {
	const { content, text, hidden, ...other } = props;
  let inner;
	if (text === undefined) {
		inner = <Typography {...other}/>;
	}
	inner = <Typography {...other}>{text}</Typography>;
  if (hidden !== undefined) {
    let args = {};
    args[hidden] = true;
    return <Hidden {...args}>{inner}</Hidden>;
  }
  return inner;
}

function cardContent(props) {
	const { classes, items } = props;
	return (
		<CardContent className={classes.content}>
			{items.map((props) => typography(props))}
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
				{content.map((props) => {
          props["classes"] = classes;
          return cardFunctions[props.type](props);
        })}
	    </Card>
		);
	}
}

export default withStyles(styles)(CustomCard);
