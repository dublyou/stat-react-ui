import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';

function toTitleCase(str) {
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const styles = theme => ({
  avatar: {
  	height: "2.5rem",
  	width: "2.5rem",
  },
  label: {
  	color: theme.palette.text.secondary,
  	fontSize: theme.typography.pxToRem(12),
  },
  list: {
  	paddingTop: 0,
  	paddingBottom: 0,
  },
  li: {
  	padding: ".5rem",
  	minWidth: "15rem",
  },
  subheader: {
  	lineHeight: "30px",
  	paddingLeft: 0,
  	paddingRight: 0,
  },
  liRootText: {
  	padding: "0 1rem",
  },
  liPrimaryText: {
  	fontSize: "1rem",
  },
  liSecondaryText: {
  }
});

class SimpleList extends React.Component {
	render() {
		let { classes, type, items, component, list_styles, styles, secondary_styles, dense } = this.props;
		let content = "";
		const li_styles = {root: classes.liRootText, primary: styles || classes.liPrimaryText, secondary: secondary_styles || classes.liSecondaryText};
		list_styles = list_styles || classes.li;

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
				if (!(items instanceof Array)) {
					items = Object.keys(items).map(value => {
						let item = {primary: items[value]};
						if (items[value] instanceof Object) {
							item = items[value];
						}
						item.label = value;
						return item;
					});
				}
				content = items.map((item, key) => {
					let image = (item.image === undefined) ? null : <Avatar className={classes.avatar} alt={item.label || item.primary} src={item.image} />;
					let label = (item.label === undefined) ? null : toTitleCase(item.label);
					return (
						<ListItem key={key} className={list_styles} button={(component === "a")} component={item.component || component || "li"} {...item.props}>
							{image}
							<ListItemText classes={li_styles} primary={item.primary} secondary={item.secondary || label} inset={item.inset}/>
						</ListItem>
					);
				});
		}
		return (
			<List className={classes.list} dense={dense}>
				{content}
			</List>
		);
	}
}

export default withStyles(styles)(SimpleList);
