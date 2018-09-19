import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chips from './chips';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import CustomCard from './customCard';
import SimpleList from './simpleList';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  table: {

  },
  tableRow: {
  	height: "20px",
  },
  tableCell: {
  	padding: ".4rem !important",
  	textAlign: "center",
  },
});

function toTitleCase(str) {
    str = "" + str;
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function simpleTable(props) {
	let { classes, data, caption } = props;
	const labels = Object.keys(data);
  let tfoot = null;
  if (caption !== undefined) {
    tfoot = <TableFooter><TableRow><TableCell colSpan={labels.length}>{caption.map((value, i) => <div key={i}>{value}</div>)}</TableCell></TableRow></TableFooter>;
  }
	return (
		<Table className={classes.table}>
			<TableHead><TableRow className={classes.tableRow}>{labels.map((value, i) => <TableCell key={i} className={classes.tableCell}>{toTitleCase(value)}</TableCell>)}</TableRow></TableHead>
			<TableBody><TableRow className={classes.tableRow}>{labels.map((value, i) => <TableCell key={i} className={classes.tableCell}>{data[value]}</TableCell>)}</TableRow></TableBody>
		  {tfoot}
    </Table>
	);
}

function getContent(props) {
  const { type, classes, ...args } = props;
  switch(type) {
  	case "list":
      args.items = args.items || args.data;
  		return <SimpleList {...args} dense={true}/>;
  	case "table":
      args.classes = classes;
  		return simpleTable(args);
    case "chips":
      return <Chips {...args}/>;
    case "cards":
      return <CustomCard {...args}/>;
  	default:
  		return <p>Error: Item type does not exist</p>
  }
}

class Expand extends React.Component {
	render() {
		const { classes, expand, ...other } = this.props;
		expand["classes"] = classes;
		const content = getContent(expand);
		return (
        <ExpansionPanel className={classes.root} {...other}>
		        <ExpansionPanelSummary classes={{root: classes.expandRoot, expanded: classes.expandExpanded, content: classes.expandSummary}} expandIcon={<ExpandMoreIcon />}>
		          <Typography className={classes.heading}>{expand.title}</Typography>
		        </ExpansionPanelSummary>
		        <ExpansionPanelDetails className={classes.expandDetails}>
		          {content}
		        </ExpansionPanelDetails>
		    </ExpansionPanel>
		);
	}
}

export default withStyles(styles)(Expand);