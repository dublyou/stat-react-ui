import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Expand from './expand';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
  	padding: 5,
  },
});

class Accordion extends React.Component {
	state = {
	    expanded: null,
	};

	handleChange = panel => (event, expanded) => {
	    this.setState({
	    	expanded: expanded ? panel : false,
	    });
	};
	render() {
		const { classes, expands } = this.props;
		const { expanded } = this.state;

		return (
			<div>
				{expands.map((value, index) => <Expand key={index} expand={value} expanded={expanded === 'panel' + index} onChange={this.handleChange('panel' + index).bind(this)}/>)}
			</div>
		);
	}
}

export default withStyles(styles)(Accordion);