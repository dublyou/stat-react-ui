import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

function toTitleCase(str) {
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const styles = theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},
	listitem: {
		paddingTop: 4,
		paddingBottom: 4,
	},
	label: {
		color: theme.palette.text.secondary,
		fontSize: theme.typography.pxToRem(12),
	},
	info: {
		textAlign: "right",
	}
});

class DetailList extends React.Component {
	render() {
		const { classes, items } = this.props;
		let list_batch = [];
		let details = [];
		let i = 0;
		const batch_size = 5;

		for (let label in items) {
			if (i > 0 && i % batch_size === 0) {
				details.push(<List dense={true} key={i/batch_size}>{list_batch}</List>);
				list_batch= [];
			}
			let { text, url } = items[label];
			let li_args = {};
			if (url !== undefined) {
				li_args["href"] = url;
				li_args["component"] = "a";
			}
			list_batch.push(<ListItem key={i} className={classes.listitem}><span className={classes.label}>{toTitleCase(label)}:&nbsp;</span><ListItemText className={classes.info} {...li_args} primary={text}/></ListItem>);
			i++;
		}
		if (list_batch.length > 0) {
			details.push(<List dense={true} key={details.length + 1}>{list_batch}</List>);
		}
		return (
			<div className={classes.root}>
				{details}
			</div>
		);
	}
}

export default withStyles(styles)(DetailList);