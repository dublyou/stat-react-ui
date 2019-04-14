import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { getImage } from '../../../utils/url';

const styles = theme => ({
    menuItem: {
        margin: `${theme.spacing.unit/2}px 0`,
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
    },
    smallAvatar: {
        width: '2rem',
        height: '2rem',
    },
    secondText: {
        justifySelf: 'flex-end',
        [theme.breakpoints.down('sm')]: {
            padding: 0,
        }
    },
    secondTextType: {
        textAlign: 'right',
        [theme.breakpoints.down('xs')]: {
            padding: `0 ${theme.spacing.unit}px`,
        }
    },
    text: {
        [theme.breakpoints.down('sm')]: {
            padding: `0 ${theme.spacing.unit}px`,
        }
    },
    primary: {
        [theme.breakpoints.down('xs')]: {
            fontSize: '.7rem'
        }
    },
    secondary: {
        [theme.breakpoints.down('xs')]: {
            fontSize: '.6rem'
        }
    }
});

class ObjectLink extends React.Component {
    render() {
        const { classes, primary, secondary, secondText, image, href, dense, denseText } = this.props;
        return (
            <MenuItem button component='a' href={href} dense={dense} className={classes.menuItem}>
                <Avatar src={getImage(image)} className={dense ? classes.smallAvatar : undefined}/>
                <ListItemText 
                    className={classes.text}
                    primary={dense ? denseText || primary : primary} 
                    secondary={secondary} 
                    primaryTypographyProps={{className: classes.primary}} 
                    secondaryTypographyProps={{className: classes.secondary}}
                />
                {secondText && (
                    <ListItemText primary={secondText} className={classes.secondText} classes={{ primary: classes.secondTextType }}/>
                )}
            </MenuItem>
        )
    }
}

export default withStyles(styles)(ObjectLink);