import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
  	width: "auto",
  	/*border: "1px solid " + theme.palette.background.default,*/
  },
  tableHeaderRow: {
    height: "1rem",
  },
  tableRow: {
    height: "2rem",
  },
  tableCell: {
    padding: ".1rem .5rem",
    textAlign: "right",
    color: theme.palette.text.secondary,
    /*backgroundColor: theme.palette.background.default,*/
    lineHeight: "initial",
    border: "none",
    "&:last-child": {
    	paddingRight: ".5rem"
    }
  },
  tableBodyCell: {
    padding: ".1rem .5rem",
    backgroundColor: theme.palette.background.default,
    textAlign: "center",
    lineHeight: "initial",
    borderLeft: ".1rem solid " + theme.palette.background.paper,
    borderBottom: ".2rem solid " + theme.palette.background.paper,
    "&:last-child": {
    	paddingRight: ".5rem"
    }
  },
});

function toTitleCase(str) {
    str = "" + str;
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

class SummaryTable extends React.Component {
	render() {
		const { classes, data } = this.props;
		let columns = Object.keys(data[0].data);

		return (
			<Table className={classes.root}>
				<TableHead>
					<TableRow className={classes.tableHeaderRow}>
						<TableCell className={classes.tableCell}></TableCell>{columns.map((value) => <TableCell key={value} className={classes.tableCell}>{value}</TableCell>)}
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row, i) => <TableRow key={i} style={{height: row.lineHeight}} className={classes.tableRow}><TableCell className={classes.tableCell}>{row.label}</TableCell>{Object.keys(row.data).map((value, i2) => <TableCell key={i + "-" + i2} style={{fontSize: row.fontSize}} className={classes.tableBodyCell}>{row.data[value]}</TableCell>)}</TableRow>)}
				</TableBody>
			</Table>
		);
	}
}

export default withStyles(styles)(SummaryTable);