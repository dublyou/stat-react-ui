import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chips from './chips';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import toTitleCase from '../utils/toTitleCase';

const styles = theme => ({
  root: {
  	margin: "5px 0",
  	minHeight: "initial",
  	backgroundColor: theme.palette.background.default,
  },
  expandRoot: {
  	minHeight: "initial"
  },
  expandSummary: {
  	margin: ".5rem 0 !important",
  	minHeight: "initial !important"
  },
  expandExpanded: {
  	minHeight: "initial !important"
  },
  expandDetails: {
  	padding: "0",
  	maxHeight: "200px",
  	overflow: "auto",
  	display: "block"
  },
});


class Expand extends React.Component {
	render() {
		const { classes, children, title, ...other } = this.props;
		const expansionPanelClasses = {root: classes.expandRoot, expanded: classes.expandExpanded, content: classes.expandSummary};

		return (
        <ExpansionPanel className={classes.root} {...other}>
		        <ExpansionPanelSummary classes={expansionPanelClasses} expandIcon={<ExpandMoreIcon />}>
		          <Typography variant='subheading'>{title}</Typography>
		        </ExpansionPanelSummary>
		        <ExpansionPanelDetails className={classes.expandDetails}>
		          {children}
		        </ExpansionPanelDetails>
		    </ExpansionPanel>
		);
	}
}

export default withStyles(styles)(Expand);