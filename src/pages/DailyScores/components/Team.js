import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import ObjectLink from './ObjectLink';

const styles = theme => ({
    
});

class Team extends React.Component {
    render() {
        const { abbrev, name, points, record, image, url, win } = this.props;
        const objectLinkProps = {
            href: url,
            image,
            primary: name,
            secondary: record,
            secondText: points,
            denseText: abbrev,
            opacity: win ? 1 : .5,
        }
        return (
            <React.Fragment>
                <Hidden xsDown>
                    <ObjectLink {...objectLinkProps}/>
                </Hidden>
                <Hidden smUp>
                    <ObjectLink dense {...objectLinkProps}/>
                </Hidden>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Team);