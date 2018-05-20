import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class Expand extends React.Component {
	render() {
		const { classes, expand } = this.props;
		const { label, content } = expand;

		return (
          	<ExpansionPanel {...this.props}>
		        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
		          <Typography className={classes.heading}>{label}</Typography>
		        </ExpansionPanelSummary>
		        <ExpansionPanelDetails>
		          {content}
		        </ExpansionPanelDetails>
		    </ExpansionPanel>
		);
	}
}

export default withStyles(styles)(Expand);