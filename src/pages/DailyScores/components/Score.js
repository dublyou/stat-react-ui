import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ObjectLink from './ObjectLink';
import Team from './Team';


const styles = theme => ({
    root: {
        margin: `${theme.spacing.unit}px 0`,
        padding: theme.spacing.unit/2,
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        maxWidth: 100,
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing.unit,
            paddingRight: theme.spacing.unit,
        },
        [theme.breakpoints.down('xs')]: {
            paddingLeft: theme.spacing.unit/2,
            paddingRight: theme.spacing.unit/2,
            minWidth: 50,
            minHeight: 25,
        }
    },
    buttonLabel: {
        fontSize: '.8rem',
        [theme.breakpoints.down('xs')]: {
            fontSize: '.7rem',
        }
    },
    teams: {
        width: 400,
        [theme.breakpoints.down('sm')]: {
            width: 350,
        },
        [theme.breakpoints.down('xs')]: {
            width: 300,
        },
    },
    statLeaders: {
        width: 300,
        [theme.breakpoints.down('sm')]: {
            width: 200,
        },
    },
});

class Score extends React.Component {
	render() {
		const { classes, away_team, home_team, stat_leaders, url } = this.props;
		return (
            <Paper className={classes.root}>
                <List className={classes.teams}>
                    <Team {...away_team}/>
                    <Team {...home_team}/>
                </List>
                <Hidden xsDown>
                    <List className={classes.statLeaders}>
                        {stat_leaders.map((leader, i) => {
                            const { image, url } = leader;
                            return <ObjectLink key={i} image={image} primary={leader.name} secondary={`${leader.value} ${leader.stat}`} href={url} dense={true}/>;
                        })}
                    </List>
                </Hidden>
                <Button variant='contained' fullWidth className={classes.button} classes={{label: classes.buttonLabel}} component='a' href={url}>Details</Button>
            </Paper>
        );
	}
}

export default withStyles(styles)(Score);