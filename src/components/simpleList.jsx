import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

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
		const { classes, type, items, component } = this.props;
		let content = "";
		switch(type) {
			case "sections":
				let sections = Object.keys(items);
				content = sections.map((s, i) => return (
					<ListSubheader key={i}>{toTitleCase(s)}</ListSubheader>
					{items[s].map((item, key) => <ListItem key={key} button component={component || "li"} {...item.props}><ListItemText primary={item.label} /></ListItem>)}
				););
			default:
				content = items.map((item, key) => <ListItem key={key} button component={component || "li"} {...item.props}><ListItemText primary={item.label} /></ListItem>);
		}
		return (
			<List>
				{content}
			</List>
		);
	}
}

export default withStyles(styles)(SimpleList);
