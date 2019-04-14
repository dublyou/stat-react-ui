import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ObjectLink from '../../components/ObjectLink';
import { getScores } from '../../api/daily_scores';


const styles = theme => ({
    team: {
        margin: 0,
        padding: 0
    },
    labelContainer: {
        padding: 0,
    },
    tab: {
        margin: theme.spacing.unit/2,
        minWidth: 120
    },
    list: {
        padding: theme.spacing.unit,
        border: `1px solid ${theme.palette.text.primary}`,
        '&:hover': {
            color: theme.palette.primary.main,
            border: `1px solid ${theme.palette.primary.main}`,
        }
    },
    root: {
        marginLeft: theme.spacing.unit,
        flex: 1,
    },
    allScores: {
        '&:hover': {
            border: `1px solid ${theme.palette.primary.main}`,
        }
    }
});

class Team extends React.Component {
    render() {
        const { className, abbrev, points, win } = this.props;

        return <ObjectLink className={className} dense primary={abbrev} secondText={points} opacity={win ? 1 : .5}/>;
    }
}

class Scores extends React.Component {
    constructor(props) { 
        super(props);
        const today = new Date();
        this.state = {
            scores: [],
            day: today.getDate() - 1,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
        }
    }

    componentDidMount() {
        this.getScores();
    }

    getScores = () => {
        const { day, month, year } = this.state;
        this.setState({isLoaded: false, scores: []});
        getScores(day, month, year).then(res => {
            this.setState({
                scores: res.data,
                isLoaded: true,
            });
        });
    };

    handleChange = (e, url) => {
        window.location.href = url;
    }

	render() {
        const { classes, hide } = this.props;
        const { scores } = this.state;

        if (scores.length === 0 || hide) {
            return null;
        }

		return (
            <Tabs className={classes.root} onChange={this.handleChange} variant='scrollable' value={false}>
                <Tab
                    className={classes.tab}
                    classes={{labelContainer: classes.labelContainer}}
                    value='/games/'
                    label={<Button component='div' className={classes.allScores} color='default' variant='text'>All Scores</Button>}
                    
                />
                {scores.map((score, i) => (
                    <Tab
                        className={classes.tab}
                        classes={{labelContainer: classes.labelContainer}}
                        key={i}
                        value={score.url}
                        label={(
                            <List className={classes.list}>
                                <Team className={classes.team} {...score.away_team}/>
                                <Team className={classes.team} {...score.home_team}/>
                            </List>
                        )}
                    />
                ))}
            </Tabs>
        );
	}
}

Scores.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
};

export default withStyles(styles)(Scores);