import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Score from './components/Score';
import SelectControl from '../../components/SelectControl';
import { getScores } from '../../api/daily_scores';
import { getDaysInMonth, months } from '../../utils/helpers';
import range from 'lodash/range';


const styles = theme => ({
    paper: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit,
        marginBottom: theme.spacing.unit * 2
    },
    button: {
        padding: theme.spacing.unit,
        maxWidth: 100,
    },
    row: {
        width: '100%',
        maxWidth: 800,
        alignItems: 'center'
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
        '&>*': {
            margin: `0 ${theme.spacing.unit/2}px`
        }
    },
    dateSelectors: {
        display: 'flex',
        margin: 'auto',
        width: '100%',
        maxWidth: 500,
        '&>*': {
            margin: `0 ${theme.spacing.unit/2}px`
        },
    }
});

class Scores extends React.Component {
    constructor(props) { 
        super(props);
        const today = new Date();
        this.years = range(1947, today.getFullYear() + 1);
        this.state = {
            scores: [],
            isLoaded: false,
            day: today.getDate() - 1,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
            dayOptions: this.getDayOptions(today.getMonth() + 1),
        }
    }

    componentDidMount() {
        this.getScores();
    }
    
    handleDateChange = (field) => (e, value=null) => {
        const newState = {
            [field]: value || e.target.value,
        }
        if (field === 'month') {
            newState.dayOptions = this.getDayOptions(newState[field]);
            if (newState.dayOptions.indexOf(newState[field]) === -1) {
                newState.day = newState.dayOptions[newState.dayOptions.length - 1];
            }
        }
        this.setState(newState, this.getScores);
    };

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

    getDayOptions = (month) => {
        const daysInMonth = getDaysInMonth(month);
        return range(1, daysInMonth + 1);
    }

    handleIncrement = (increment) => () => {
        this.setState((state, props) => {
            const { day, dayOptions, month, year} = state;
            const newDay = day + increment;
            if (dayOptions.indexOf(newDay) > -1) {
                return {day: newDay};
            }
            let newMonth = month + increment;
            let newYear = year;
            if (newMonth === 0 || newMonth === 13) {
                newMonth = increment === 1 ? 1 : 12;
                newYear = year + increment;
            }
            const newDayOptions = this.getDayOptions(newMonth);
            return {
                day: newMonth > month ? 1 : newDayOptions[newDayOptions.length - 1],
                dayOptions: newDayOptions,
                month: newMonth,
                year: newYear,
            }
        }, this.getScores);
    }

	render() {
        const { classes } = this.props;
        const { day, dayOptions, month, isLoaded, scores, year } = this.state;
        const dateSelectors = (
            <div className={classes.dateSelectors}>
                <SelectControl label='Month' onChange={this.handleDateChange('month')} value={month} options={months.map((value, i) => ({value: i + 1, label: value}))}/>
                <SelectControl label='Day' onChange={this.handleDateChange('day')} value={day} options={dayOptions.map(value => ({value, label: value}))} maxWidth={100}/>
                <SelectControl label='Year' onChange={this.handleDateChange('year')} value={year} options={this.years.map(value => ({value, label: value}))}/>
            </div>
        );

		return (
            <React.Fragment>
                <Paper className={classes.paper}>
                    <Hidden smUp>
                        {dateSelectors}
                    </Hidden>
                    <Hidden xsDown>
                        <Toolbar className={classes.toolbar}>
                            <Button className={classes.button} fullWidth variant='contained' onClick={this.handleIncrement(-1)}><ChevronLeftIcon/>Prev</Button>
                            {dateSelectors}
                            <Button className={classes.button} fullWidth variant='contained' onClick={this.handleIncrement(1)}>Next<ChevronRightIcon/></Button>
                        </Toolbar>
                    </Hidden>
                </Paper>
                {isLoaded ? (scores.length > 0 ? scores.map((score, i) => <Score key={i} {...score}/>) : (
                    <Typography variant='h4' style={{textAlign: 'center'}}>No Scores on {months[month - 1]} {day}, {year}</Typography>
                )) : <div style={{textAlign: 'center'}}><CircularProgress color='primary'/></div>}
                <Hidden smUp>
                    <Paper className={classes.paper}>
                        <Toolbar className={classes.toolbar}>
                            <Button className={classes.button} fullWidth variant='contained' onClick={this.handleIncrement(-1)}><ChevronLeftIcon/>Prev</Button>
                            <Button className={classes.button} fullWidth variant='contained' onClick={this.handleIncrement(1)}>Next<ChevronRightIcon/></Button>
                        </Toolbar>
                    </Paper>
                </Hidden>
            </React.Fragment>
        );
	}
}

Scores.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
};

export default withStyles(styles)(Scores);