import React from 'react';
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
  },
  list: {
  	paddingTop: 0,
  	paddingBottom: 0,
  },
  li: {
  	padding: 5,
  },
  subheader: {
  	lineHeight: "30px",
  	paddingLeft: 0,
  	paddingRight: 0,
  }
});

class SimpleList extends React.Component {
	render() {
		const { classes, type, items, component } = this.props;
		let content = "";
		switch(type) {
			case "sections":
				let sections = Object.keys(items);
				content = sections.map((s, i) => (
					<ListItem key={i} className={classes.li}>
						<List key={i} className={classes.list} subheader={<ListSubheader key={i} className={classes.subheader}>{toTitleCase(s)}</ListSubheader>}>
							{items[s].map((item, key) => (
								<ListItem key={`section-${i}-${key}`} className={classes.li} button component={component || "li"} {...item.props}>
									<ListItemText primary={item.label} />
								</ListItem>
								)
							)
							}
						</List>
					</ListItem>
				));
				break;
			default:
				content = items.map((item, key) => (
					<ListItem key={key} className={classes.li} button component={component || "li"} {...item.props}>
						<ListItemText primary={item.label} />
					</ListItem>
					)
				);
		}
		return (
			<List className={classes.list}>
				{content}
			</List>
		);
	}
}

export default withStyles(styles)(SimpleList);
