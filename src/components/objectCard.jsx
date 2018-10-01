import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import { getImage } from '../utils/url';

const styles = theme => ({
    card: {
        display: "inline-block",
        '&last-child': {
            marginRight: 0
        }
    },
    cardHeader: {
        padding: ".2rem",
        display: "flex",
        
    },
    cardHeaderAvatar: {
        marginRight: ".5rem",
    },
    cardHeaderContent: {
        marginRight: ".5rem",
        textDecoration: "none",
        flex: "1 0 auto",
        "&:hover": {
            opacity: .5
        }
    },
    cardHeaderAction: {
        position: 'absolute',
        top: '1rem',
        right: '2rem',
    },
    icon: {
        width: "1rem",
        height: "1rem",
    },
    iconButton: {
        width: "1.5rem",
        height: "1.5rem",
        backgroundColor: theme.palette.background.default,
        margin: '.1rem',
    },
})

class ObjectCard extends React.Component {
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

    render() {
        const { classes, image, name, subheader, url, handleCloseClick, handleFilterClick, condense=true } = this.props;
        const actions = [];
        const avatarSize = {
            width: "3rem",
            height: "3rem",
        }
        if (condense) {
            avatarSize.width = '2rem';
            avatarSize.height = '2rem';
        }
        if (handleCloseClick !== undefined) {
            actions.push(<IconButton key='close' className={classes.iconButton} onClick={handleCloseClick}><CloseIcon className={classes.icon}/></IconButton>);
        }
        if (handleFilterClick !== undefined) {
            actions.push(<IconButton key='filter' className={classes.iconButton} onClick={handleFilterClick}><FilterListIcon className={classes.icon}/></IconButton>);
        }
        return (
            <Card onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                <CardHeader
                    className={classes.cardHeader}
                    action={(actions.length > 0) ? <span style={{visibility: 'hidden', display: 'flex', flexDirection: condense ? 'row' : 'column'}} ref={this.action}>{actions}</span> : null}
                    avatar={<Avatar style={avatarSize} alt={name} src={getImage(image)} />}
                    classes={{ avatar: classes.cardHeaderAvatar, action: classes.cardHeaderAction, title: classes.cardHeaderContent }}
                    title={name || null}
                    titleTypographyProps={{ component: "a", href: url, target: "_blank", noWrap: true}}
                    subheader={(condense ? null : subheader) || null}
                    subheaderTypographyProps={{noWrap: true}}
                />
            </Card>
        );
    }
}

export default withStyles(styles)(ObjectCard);