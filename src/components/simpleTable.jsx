import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { toTitleCase } from '../utils/helpers';

const styles = theme => ({
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

class SimpleTable extends React.Component {
	render() {
		const { classes, data, caption } = this.props;
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
}

export default withStyles(styles)(SimpleTable);