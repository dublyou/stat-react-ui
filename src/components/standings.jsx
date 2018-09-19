import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Axes from './axes';
import SimpleList from './simpleList';
import Slider from './slider';
import standings_data from '../sample_data/standings_raw_data';
import { extent as d3extent, sum as d3sum, max as d3max, min as d3min } from 'd3-array';
import { nest as d3nest} from 'd3-collection';
import throttle from 'lodash/throttle';

const styles = theme => ({
  root: {
  	display: "flex",
  	flexWrap: "wrap",
    height: 500,
    padding: '3rem',
    paddingTop: 90,
  },
  standingsBar: {
    backgroundColor: theme.palette.background.default,
    marginLeft: "3rem",
    marginRight: "2rem",
    position: "relative",
    flex: "1 0 auto",
  },
  standingsPoint: {
    position: "absolute",
    transition: "all .5s ease"
  },
  chartPoint: {
    position: "absolute",
    display: "none",
  },
  team: {
    marginTop: "-1rem",
  },
  teamDetails: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  teamLogo: {
    width: "2rem",
    height: "2rem",
    '&:hover': {
      zIndex: 1,
      border: "3px solid #fff",
      cursor: "pointer",
      marginLeft: -3,
    },
    '&:focus': {
      zIndex: 1,
      border: "3px solid #fff",
      cursor: "pointer",
      marginLeft: -3,
    }
  },
  cardHeader: {
    padding: ".2rem"
  },
  cardContent: {
    padding: ".2rem"
  },
});

class TeamAvatar extends React.Component {
  state = {
    clicked: false,
    show: false,
    inDetails: false,
  };
  constructor(props) {
      super(props);
      this.card = React.createRef();
  }

  handleClick = () => {
    this.setState({clicked: true, show: true});
  };

  handleBlur = () => {
    if (!this.state.inDetails) {
      this.setState({clicked: false, show: false});
    }
  };

  handleDetailMouseEnter = () => {
    this.setState({inDetails: true});
  };

  handleDetailMouseLeave = () => {
    this.setState({inDetails: false});
  };

  handleDetailBlur = () => {
    if (!this.state.inDetails) {
      this.setState({clicked: false, show: false});
    }
  };

  handleMouseEnter = () => {
    const { ref } = this.props;
    this.setState({show: true});
  };

  handleMouseLeave = () => {
    if (!this.state.clicked) {
      this.setState({show: false});
    }
  };

  render() {
    const { classes, data, styles } = this.props;
    let items = [];
    items.push({primary: "Record", secondary: `${data.wins}-${data.losses}`});
    items.push({primary: "Win %", secondary: (data.wins/data.games).toFixed(3)});
    items.push({primary: "Games Back", secondary: data.gb});
    items.push({primary: "PPG", secondary: data.PPG.toFixed(1)});
    items.push({primary: "OPPG", secondary: data.OPPG.toFixed(1)});
    items.push({primary: "Diff", secondary: (data.PPG - data.OPPG).toFixed(1)});
    return (
      <div className={classes.team} onBlur={this.handleBlur} style={styles}>
        <Zoom in={this.state.show}>
          <span ref={this.card} tabIndex="0" className={classes.teamDetails} onBlur={this.handleDetailBlur} onMouseEnter={this.handleDetailMouseEnter} onMouseLeave={this.handleDetailMouseLeave}>
            <Card>
              <CardHeader
                title={data.team_name}
                subheader={`${data.conference} / ${data.division}`}
                titleTypographyProps={{noWrap: true, component: "a", href: data.team_url, variant: "body2"}}
                subheaderTypographyProps={{noWrap: true}}
                classes={{root: classes.cardHeader}}
              />
              <CardContent classes={{root: classes.cardContent}}>
                <table>
                  <tbody>
                    {items.map((value, i) => <tr key={i}><th><Typography align="left" variant='body2' noWrap={true}>{value.primary}</Typography></th><td><Typography align="right" variant='caption'>{value.secondary}</Typography></td></tr>)}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </span>
        </Zoom>
        <Avatar className={classes.teamLogo} tabIndex="0" onClick={this.handleClick} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} alt={data.team_id} src={`/teams/franchise_logos/${data.team_id}1.png`} />
      </div>
    );
  }
}

class Standings extends React.Component {
  state = {
    position: 99,
    date: null,
    data: [],
    mousePositions: [0, 0],
  };

  constructor(props) {
      super(props);
      this.chart = React.createRef();
      this.point = React.createRef();
  }

  componentWillMount() {
    let raw_data = standings_data.map(row => {
      row.date = new Date(row.date);
      return row;
    });
    this.teams = this.getTeamRefs(raw_data);
    let date_range = d3extent(raw_data, row => row.date);
    this.days = Math.abs((date_range[0] - date_range[1]) / (24*60*60*1000));
    this.date_range = date_range;
    this.data = raw_data;
    this.getData(date_range[1]);
    this.setState({date: date_range[1]});
  }

  getTeamRefs = (data) => {
      let items = [];
      let teams = {};
      let addItem = true;
      for (let row of data) {
          addItem = true;
          for (let item of items) {
              if (item === row["team_id"]) {
                  addItem = false;
              }
          }
          if (addItem) {
            teams[row["team_id"]] = React.createRef();
          }
      }
      return teams;
  };

  handleTeamMouseEnter = (team_id) => (event) => {
    this.teams[team_id].current.style.overflow = "visible";
  };

  handleTeamMouseLeave = (team_id) => (event) => {
    this.teams[team_id].current.style.overflow = "hidden";
  };

  getData = (date) => {
    let data = this.data.filter(row => row.date <= date);
    data = d3nest().key(row => row.team_id).rollup(value => {
      let new_row = {
        gb: d3sum(value, row => (row.win) ? .5 : -.5),
        games: value.length,
        wins: d3max(value, row => row.wins),
        losses: d3max(value, row => row.losses),
        PPG: d3sum(value, row => row.PTS) / value.length,
        OPPG: d3sum(value, row => row.OPTS) / value.length,
      };
      let labels = ["team_name", "team_url", "conference", "division"];
      for (let label of labels) {
        new_row[label] = value[0][label];
      }
      return new_row;
    }).object(data);
    data = Object.keys(data).map(value => {
      let row = data[value];
      row.team_id = value;
      return row;
    });
    let gb_max = d3max(data, row => row.gb);
    let gb_min = d3min(data, row => row.gb) - gb_max;
    let gb_range = [gb_min, 0];
    data = d3nest().key(row => `${row.gb}-${row.games}`).rollup(value => {
      for (let row2 of value) {
        row2.gb = row2.gb - gb_max;
      }
      return value;
    }).object(data);
    this.setState({data, gb_range, date});
  };

  throttleData = throttle((date) => {
      this.getData(date);
  }, 100);

  handleDateChange = (position) => {
    let date = new Date(this.date_range[0]);
    let days = Math.round(this.days * position, 0);
    position = days / this.days * 100;
    date.setDate(date.getDate() + days);
    this.getData(date);
    return {position: days / this.days, value: date.toDateString()};
  };

  handleMouseMove = (event) => {
    let pageX = event.pageX;
    let pageY = event.pageY;
    let offsetX = this.chart.current.offsetLeft;
    let offsetY = this.chart.current.offsetTop;
    let width = this.chart.current.offsetWidth;
    let height = this.chart.current.offsetHeight;
    let posX = pageX - offsetX;
    let posY = height - (pageY - offsetY);
    this.point.current.style.display = "block";
    this.setState({mousePositions: [posX/width, posY/height]});
  };

  handleMouseOut = (event) => {
    this.point.current.style.display = "none";
  };

	render() {
		const { classes } = this.props;
    let { date, data, gb_range, mousePositions } = this.state;
    let daysPerc = Math.abs((date - this.date_range[0]) / (24*60*60*1000))/this.days;
    let teams = [];
    for (let value in data) {
      let rows = data[value];
      for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let styles = {
          left:`calc(${(50 + 50*daysPerc) * (1 - row.gb/gb_range[0])}% - 1rem)`,
          top: `${100 - row.games/82 * 100}%`,
        }
        let avatarStyles = {};
        if (1 < rows.length < 5 ) {
          styles.height = "1rem";
          if (i === 0 || i === 3) {
            styles.marginTop = "-1rem";
            avatarStyles.marginTop = 0;
          }
          if (i === 0 && rows.length === 4) {
            styles.width = "1rem";
          } else if (i === 1 && rows.length > 2) {
            styles.width = "1rem";
          } else if (i > 1) {
            styles.width = "1rem";
            if (i === 2) {
              styles.marginLeft = "1rem";
              avatarStyles.marginLeft = "-1rem";
            }
          }
        }
        teams.push(
          <div key={row.team_id} style={styles} ref={this.teams[row.team_id]} className={classes.standingsPoint} onMouseEnter={this.handleTeamMouseEnter(row.team_id)} onMouseLeave={this.handleTeamMouseLeave(row.team_id)}>
            <TeamAvatar styles={avatarStyles} classes={classes} data={row}/>
          </div>
        );
      }
    }
		return (
        <Paper className={classes.root} style={{paddingTop: 90}}>
          <div ref={this.chart} className={classes.standingsBar} onMouseMove={this.handleMouseMove} onMouseOut={this.handleMouseOut}>
            <div ref={this.point} className={classes.chartPoint} style={{left: `${mousePositions[0]*100}%`, bottom: `${mousePositions[1]*100}%`}}>
              <table>
                  <tbody>
                    <tr>
                        <th><Typography align="left" variant='body2' noWrap={true}>Games Back</Typography></th>
                        <td><Typography align="right" variant='caption'>{Math.round(Math.abs(gb_range[0]) * mousePositions[0] / (.5 + .5 * daysPerc) * 2, 0)/2 + gb_range[0]}</Typography></td>
                    </tr>
                    <tr>
                        <th><Typography align="left" variant='body2' noWrap={true}>Games</Typography></th>
                        <td><Typography align="right" variant='caption'>{Math.round(82 * mousePositions[1], 0)}</Typography></td>
                    </tr>
                  </tbody>
              </table>
            </div>
            <Axes key="games" type="vertical" range={[0, 82]} offset={2} axisLabelName="Games"/>
            <Axes key="games_back" range={gb_range} axisLabelName="Games Back" scaleAdj={daysPerc * .5 + .5}/>
            {teams}
          </div>
          <Slider handlePositionChange={this.handleDateChange} orient="vertical" startValue={date.toDateString()}/>
        </Paper>
		);
	}
}

export default withStyles(styles)(Standings);