import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { getImage } from '../utils/url';

const styles = theme => ({
    listItem: {
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
        paddingRight: 0,
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
        fontSize: 'inherit',
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
        const { classes, className, primary, secondary, secondText, image, dense, denseText, opacity, ...other } = this.props;
        return (
            <ListItem dense={dense} className={`${classes.listItem} ${className || ''}`} style={{opacity: opacity}} {...other}>
                {image && <Avatar src={getImage(image)} className={dense ? classes.smallAvatar : undefined}/>}
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
            </ListItem>
        )
    }
}

export default withStyles(styles)(ObjectLink);