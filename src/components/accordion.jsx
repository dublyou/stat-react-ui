import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CustomCard from './customCard';
import Expand from './expand';
import SelectMenu from './selectMenu';
import SimpleList from './simpleList';
import SimpleTable from './simpleTable';

const styles = theme => ({
  root: {
  },
});

function getContent(props) {
	const { type, ...other } = props;
	switch(type) {
		case "list":
			other.items = other.items || other.data;
			return <SimpleList {...other} dense={true}/>;
		case "table":
			return <SimpleTable {...other}/>;
	  	case "chips":
			return <Chips {...other}/>;
	  	case "cards":
			return <CustomCard {...other}/>;
		case "select-menu":
			return <SelectMenu {...other}/>;
		default:
			return null;
	}
}

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
				{expands.map((props, index) => {
					const { title, ...other } = props;
					return (
						<Expand 
							key={'panel' + index}
							title={title}
							expanded={expanded === 'panel' + index} 
							onChange={this.handleChange('panel' + index)}
						>
							{getContent(other)}
						</Expand>
					);
				})}
			</div>
		);
	}
}

export default withStyles(styles)(Accordion);