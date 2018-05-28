import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function toTitleCase(str) {
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const styles = theme => ({
  label: {
  	color: theme.palette.text.secondary,
  	fontSize: theme.typography.pxToRem(12),
  }
});

class SimpleList extends React.Component {
	render() {
		const { classes, items } = this.props;
		return (
			<List>
				{items.map((item) => <ListItem button component="a" href={item.url}><ListItemText primary={item.label} /></ListItem>)}
			</List>
		);
	}
}

export default withStyles(styles)(SimpleList);
