import React from 'react';
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { Row, Col } from 'react-flexa';
import Score from './components/Score';
import SelectControl from '../../components/SelectControl';
import { getScores } from '../../api/daily_scores';
import { getDaysInMonth, months } from '../../utils/helpers';
import range from 'lodash/range';


const styles = theme => ({
    root: {
        padding: '1rem 0',
    },
    button: {
        padding: '1rem',
        minWidth: 50,
    },
    row: {
        width: '100%',
        maxWidth: 800,
    },
    toolbar: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 .5rem',
    }
});

class Scores extends React.Component {
    constructor(props) { 
        super(props);
        const today = new Date();
        this.years = range(1947, today.getFullYear() + 1);
        this.state = {
            data: [],
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
        getScores(day, month, year).then(res => {
            this.setState({
                data: res.data,
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
        const { day, dayOptions, month, year } = this.state;
		return (
            <div className={classes.root}>
                <div className={classes.toolbar}>
                    <Row className={classes.row} alignItems='center'>
                        <Col xs={0} sm={2}>
                            <Button className={classes.button} fullWidth={true} variant='contained' onClick={this.handleIncrement(-1)}>&#171;Prev</Button>
                        </Col>
                        <Col xs={6} sm={4}>
                            <SelectControl label='Month' onChange={this.handleDateChange('month')} value={month} options={months.map((value, i) => ({value: i + 1, label: value}))}/>
                        </Col>
                        <Col xs={3} sm={2}>
                            <SelectControl label='Day' onChange={this.handleDateChange('day')} value={day} options={dayOptions.map(value => ({value, label: value}))}/>
                        </Col>
                        <Col xs={3} sm={2}>
                            <SelectControl label='Year' onChange={this.handleDateChange('year')} value={year} options={this.years.map(value => ({value, label: value}))}/>
                        </Col>
                        <Col xs={0} sm={2}>
                            <Button className={classes.button} fullWidth={true} variant='contained' onClick={this.handleIncrement(1)}>Next&#187;</Button>
                        </Col>
                    </Row>
                    <Row className={classes.row}>
                        <Col xs={6} sm={0}>
                            <Button className={classes.button} size='small' fullWidth={true} variant='contained' onClick={this.handleIncrement(-1)}>&#171;Prev</Button>
                        </Col>
                        <Col xs={6} sm={0}>
                            <Button className={classes.button} size='small' fullWidth={true} variant='contained' onClick={this.handleIncrement(1)}>Next&#187;</Button>
                        </Col>
                    </Row>
                </div>
                {this.state.data.map((score, i) => <Score key={i} {...score}/>)}
            </div>
        );
	}
}

Scores.propTypes = {
    match: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object,
};

export default withStyles(styles)(Scores);