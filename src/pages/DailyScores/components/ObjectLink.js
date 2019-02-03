import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { getUrl, getImage } from '../../../utils/url';

const styles = theme => ({
    smallAvatar: {
        width: '2rem',
        height: '2rem',
    },
    smallItem: {
        padding: '.5rem',
    },
    secondText: {
        justifySelf: 'flex-end',
    },
    secondTextType: {
        textAlign: 'right',
    }
});

class ObjectLink extends React.Component {
    render() {
        const { classes, primary, secondary, secondText, image, href, dense } = this.props;
        return (
            <MenuItem button component='a' href={getUrl(href)} dense={dense} className={dense ? classes.smallItem : undefined}>
                <Avatar src={getImage(image)} className={dense ? classes.smallAvatar : undefined}/>
                <ListItemText primary={primary} secondary={secondary} />
                {secondText && (
                    <ListItemText primary={secondText} className={classes.secondText} classes={{ primary: classes.secondTextType }}/>
                )}
            </MenuItem>
        )
    }
}

export default withStyles(styles)(ObjectLink);