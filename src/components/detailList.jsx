import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

function toTitleCase(str) {
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const styles = theme => ({
  label: {
  	color: theme.palette.text.secondary,
  	fontSize: theme.typography.pxToRem(12),
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
				details.push(<List dense={true} key={i}>{details_batch}</List>);
				list_batch= [];
			}
			let { text, url } = items[label];
			let li_args = {};
			if (url !== undefined) {
				li_args["href"] = url;
				li_args["component"] = "a";
			}
			list_batch.push(<ListItem key={i}><span className={classes.label}>{toTitleCase(label)}:&nbsp;</span><ListItemText {...li_args} primary={items[label]}/></ListItem>);
			i++;
		}
		if (details.length > 0) {
			details.push(<List dense={true} key={i}>{list_batch}</List>);
		}
		return (
			<div>
				{details}
			</div>
		);
	}
}

export default withStyles(styles)(DetailList);