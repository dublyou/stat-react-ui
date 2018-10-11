import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import get from 'lodash/get';


const styles = theme => ({
    action: {
        position: 'absolute',
        visibility: 'hidden',
        right: 0,
        top: 0,
    },
    icon: {
        width: "1rem",
        height: "1rem",
    },
    iconButton: {
        width: "1.5rem",
        height: "1.5rem",
        backgroundColor: theme.palette.background.default,
        margin: '.2rem',
    },
    tableCell: {
        padding: ".5rem",
        textAlign: "left",
        fontSize: "1rem",
        backgroundColor: theme.palette.background.default,
        position: "relative",
        borderBottom: "none",
        "&:last-child": {
            paddingRight: ".5rem"
        }
    },
    tableHeadCell: {
        padding: ".5rem",
        textAlign: "left",
        fontSize: "1rem",
        backgroundColor: theme.palette.background.default,
        position: "relative",
        borderBottom: "none",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: theme.palette.grey[900],
            color: theme.palette.primary.main,
        },
        "&:last-child": {
            paddingRight: ".5rem"
        }
    },
    tableBodyCell: {
        color: theme.palette.grey[800],
        fontSize: "1.25rem",
        paddingLeft: ".5rem",
        paddingRight: ".5rem",
        borderBottom: "none",
        whiteSpace: "nowrap",
        "&:last-child": {
            paddingRight: ".5rem"
        }
    },
});

class DataTableCell extends React.Component {
    constructor(props) {
        super(props);
        this.action = React.createRef();
    }

    handleMouseEnter = () => {
        const action = this.action.current;
        if (action !== undefined) {
            action.style.visibility = 'visible';
        }
    };

    handleMouseLeave = () => {
        const action = this.action.current;
        if (action !== undefined) {
            action.style.visibility = 'hidden';
        }
    };

    getActionButton = (actionType) => {
        const { classes, handleActionClick } = this.props;
        switch (actionType) {
            case 'close':
                return <IconButton key='filter' className={classes.iconButton} onClick={handleActionClick}><CloseIcon className={classes.icon}/></IconButton>;
            default:
                return null;
        }
    };

    getClassName = () => {
        const { classes, clickable, component, onClick } = this.props;
        const { tableCell, tableHeadCell, tableBodyCell } = classes;
        if (component === 'th') {
            return `${(onClick !== undefined) || clickable ? tableHeadCell : tableCell}`;
        } else {
            return `${tableBodyCell}`;
        }
    };

    getStyles = () => {
        const { styles={}, children } = this.props;
        styles.whiteSpace = get(styles, 'whitespace', 'nowrap');
        if (styles.textAlign === undefined) {
            if (!isNaN(+children)) {
                styles.textAlign = 'right';
            } else if (typeof children === 'string') {
                if (/^(?:[\d\.]+\s*\%?|\$?\s*[\d,\.]+)$/.test()) {
                    styles.textAlign = 'right';
                }
            }
        }
        return styles;
    };

    render() {
        const { classes,  className='', children, styles, actionType=null, handleActionClick, ...other } = this.props;
        const action = (actionType !== null) ? <span className={classes.action} ref={this.action}>{this.getActionButton(actionType)}</span> : null;

        return (
            <TableCell 
                style={this.getStyles()} 
                className={`${this.getClassName()} ${className}`} 
                onMouseEnter={actionType === null ? null : this.handleMouseEnter} 
                onMouseLeave={actionType === null ? null : this.handleMouseLeave} 
                {...other}>
                {children}{action}
            </TableCell>);
    }
}

export default withStyles(styles)(DataTableCell);