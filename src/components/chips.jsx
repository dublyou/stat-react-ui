import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  root: {
  	display: "flex",
  	flexWrap: "wrap",
  	margin: ".5rem"
  },
  chipRoot: {
  	margin: ".1rem auto",
  	borderRadius: "1rem",
  	height: "1.5rem"
  },
  chipLabel: {
  	paddingLeft: ".75rem",
  	paddingRight: ".75rem"
  },
  chipAvatar: {
  	height: "1.5rem",
  	width: "auto",
  	borderRadius: "1rem",
    padding: "0 5px",
    fontSize: ".75rem"
  }
});

class Chips extends React.Component {
	render() {
		const { classes, data } = this.props;
		return (
          	<div className={classes.root}>
          		{Object.keys(data).map((value, i) => <Chip classes={{root: classes.chipRoot, avatar: classes.chipAvatar}} key={i} avatar={<Avatar>{value}</Avatar>} label={data[value].join(" / ")} />)}
          	</div>
		);
	}
}

export default withStyles(styles)(Chips);