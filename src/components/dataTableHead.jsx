import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DataTableCell from './dataTableCell';

const styles = theme => ({
    tableHeadRow: {
        height: 30,
        transform: 'none',

    },
    tableHead: {
        transform: 'none',
    },
});


class DataTableHead extends React.Component {
    constructor(props) {
        super(props);
        this.stickyHeader = React.createRef();
    }

    componentDidMount() {
        const { sticky=false } = this.props;
        if (sticky) {
            var checkExist = setInterval(() => {
                if (this.stickyHeader.current !== null) {
                    const elemRect = this.stickyHeader.current.getBoundingClientRect();
                    const startPos = elemRect.top - 64 + window.pageYOffset;
                    window.addEventListener('scroll', this.transformTableHeader(startPos));
                    clearInterval(checkExist);
                }
            }, 100);
        }
    };

    componentWillUnmount() {
        const { sticky=false } = this.props;
        if (sticky) {
            window.removeEventListener('scroll', this.transformTableHeader());
        }
    };

    transformTableHeader = (startPos) => () => {
        if (this.stickyHeader.current !== null) {
            if (window.pageYOffset > startPos) {
                this.stickyHeader.current.style.transform = "translate3d(0px, " + (window.pageYOffset - startPos) + "px, 1px)";
            } else {
                this.stickyHeader.current.style.transform = 'none';
            }
        }
    };

    getTableHeadComponent = () => {
        const { sticky=false } = this.props;
        return sticky ? (props) => <thead ref={this.stickyHeader}>{props.children}</thead> : 'thead';
    };

    render() {
        const { classes, columns } = this.props;
        return (
            <TableHead className={classes.tableHead} component={this.getTableHeadComponent()}>
                <TableRow className={classes.tableHeadRow}>
                    {columns.map((column, i) => {
                        const { render, calc, label, ...other } = column;
                        const props = {
                            component: 'th',
                            ...other
                        };
                        return <DataTableCell key={i} {...props}>{label}</DataTableCell>;
                    })}
                </TableRow>
            </TableHead>
        );
    }
}

export default withStyles(styles)(DataTableHead);