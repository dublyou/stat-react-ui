import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ObjectLink from './ObjectLink';

const styles = theme => ({
    tableCell: {
        border: 'none',
        padding: '.5rem .2rem',
    },
    tableRowLoser: {
        opacity: .5,
    }
});

class Team extends React.Component {
    render() {
        const { classes, dense, name, points, record, image, url, win } = this.props;
        return (
            <li className={win ? undefined : classes.tableRowLoser}>
                <ObjectLink dense={dense} href={url} image={image} primary={name} secondary={record} secondText={points}/>
            </li>
        );
    }
}

export default withStyles(styles)(Team);