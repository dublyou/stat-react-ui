import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import SimpleList from './simpleList';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function getContent(props) {
  const { type, args } = props;
  switch(type) {
  	case "list":
  		return <SimpleList {...args}/>;
  	default:
  		return <p>Error: Item type does not exist</p>
  }
}

class Expand extends React.Component {
	render() {
		const { classes, title, ...other } = this.props;
		const content = getContent(other);
		return (
          	<ExpansionPanel {...this.props}>
		        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
		          <Typography className={classes.heading}>{title}</Typography>
		        </ExpansionPanelSummary>
		        <ExpansionPanelDetails>
		          {content}
		        </ExpansionPanelDetails>
		    </ExpansionPanel>
		);
	}
}

export default withStyles(styles)(Expand);