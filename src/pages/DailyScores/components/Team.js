import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
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
        const { classes, abbrev, name, points, record, image, url, win } = this.props;
        const objectLinkProps = {
            href: url,
            image,
            primary: name,
            secondary: record,
            secondText: points,
            denseText: abbrev,
        }
        return (
            <li className={win ? undefined : classes.tableRowLoser}>
                <Hidden xsDown>
                    <ObjectLink {...objectLinkProps}/>
                </Hidden>
                <Hidden smUp>
                    <ObjectLink dense {...objectLinkProps}/>
                </Hidden>
            </li>
        );
    }
}

export default withStyles(styles)(Team);