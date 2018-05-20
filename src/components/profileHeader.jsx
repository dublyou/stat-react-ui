import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DetailList from './detailList';
import Accordion from './accordion';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
  	padding: 5,
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
});

class ProfileHeader extends React.Component {
	render() {
		const { classes, header } = this.props;
		const { name, image_path, details, expands} = header;

		return (
			<Paper className={classes.root} elevation={4}>
				<Typography variant="headline">{header.name}</Typography>
				<Card className={classes.card}>
					<div className={classes.container}>
						<img
						 	className={classes.image}
							src={header.image_path || 'https://d2p3bygnnzw9w3.cloudfront.net/req/201805011/tlogo/bbr/GSW-2018.png'}
							alt={header.name}
				        />
			        </div>
			        <div className={classes.details}>
			          <DetailList items={details}/>
			          {(expands === undefined) ? "" : <Accordion expands={expands}/>}
			        </div>
		    	</Card>
			</Paper>
		);
	}
}

export default withStyles(styles)(ProfileHeader);
