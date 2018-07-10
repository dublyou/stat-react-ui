import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Expand from './expand';

const styles = theme => ({
  root: {
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
			<div className={classes.root}>
				{expands.map((value, index) => <Expand key={'panel' + index} expand={value} expanded={expanded === 'panel' + index} onChange={this.handleChange('panel' + index).bind(this)}/>)}
			</div>
		);
	}
}

export default withStyles(styles)(Accordion);