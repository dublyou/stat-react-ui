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
  liText: {
  	fontSize: "1rem",
  }
});

class SimpleList extends React.Component {
	render() {
		let { classes, type, items, component, styles, dense } = this.props;
		let content = "";
		const li_styles = {primary: styles || classes.liText};
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
				content = items.map((item, key) => {
					let image = (item.image === undefined) ? null : <Avatar alt={item.label || item.primary} src={item.image} />;
					let label = (item.label === undefined) ? null : <span className={classes.label}>{toTitleCase(item.label)}:&nbsp;</span>
					return (
						<ListItem key={key} className={classes.li} button component={item.component || component || "li"} {...item.props}>
							{image}
							{label}
							<ListItemText classes={li_styles} primary={item.primary || item.label} secondary={item.secondary} inset={item.inset}/>
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
