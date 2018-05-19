import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  root: {
  	padding: 5,
  },
  label: {
  	color: theme.palette.text.secondary,
  	fontSize: theme.typography.pxToRem(12),
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: {
   	height: "auto",
   	minWidth: 100,
   	width: "100%"
  },
  container: {
  	maxWidth: 250,
  	width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}

class ProfileHeader extends React.Component {
	render() {
		const { classes, image_path} = this.props;
		let details = [];
		let details_batch = [];
		const batch_size = 5;

		for (var i = 0; i < 13; i++) {
			if (i > 0 && i % batch_size === 0) {
				details.push(<CardContent key={i}><List dense={true} key={i}>{details_batch}</List></CardContent>);
				details_batch= [];
			}
			details_batch.push(<ListItem key={i}><span className={classes.label}>Label:&nbsp;</span><ListItemText primary={"Item " + i}/></ListItem>);
		}
		if (details.length > 0) {
			details.push(<CardContent key="13"><List dense={true} key="13">{details_batch}</List></CardContent>);
		}
		return (
			<Paper className={classes.root} elevation={4}>
				<Typography variant="headline">Profile Name</Typography>
				<Card className={classes.card}>
					<div className={classes.container}>
						<img
						 	className={classes.image}
							src={image_path || 'https://d2p3bygnnzw9w3.cloudfront.net/req/201805011/tlogo/bbr/GSW-2018.png'}
							alt="Live from space album cover"
				        />
			        </div>
			        <div className={classes.details}>
			          {details}
			          <CardContent>
			          	<ExpansionPanel>
					        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
					          <Typography className={classes.heading}>Awards</Typography>
					        </ExpansionPanelSummary>
					        <ExpansionPanelDetails>
					          {details_batch}
					        </ExpansionPanelDetails>
					    </ExpansionPanel>
			          </CardContent>
			        </div>
		    	</Card>
			</Paper>
		);
	}
}

export default withStyles(styles)(ProfileHeader);
