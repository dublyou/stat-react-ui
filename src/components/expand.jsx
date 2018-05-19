import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const styles = theme => ({
  root: {
  	padding: 5,
  }
});

class Expand extends React.Component {
	render() {
		const { classes, expand } = this.props;

		return (
          	<ExpansionPanel>
		        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
		          <Typography className={classes.heading}>{expand.label}</Typography>
		        </ExpansionPanelSummary>
		        <ExpansionPanelDetails>
		          {details_batch}
		        </ExpansionPanelDetails>
		    </ExpansionPanel>
		);
	}
}

export default withStyles(styles)(ProfileHeader);