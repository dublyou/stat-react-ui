import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import throttle from 'lodash/throttle';

const styles = theme => ({
  track: {
    height: "10px",
    width: "10px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "5px",
    flex: "0 0 auto",
    cursor: "pointer",
    position: "relative"
  },
  slider: {
    position: "absolute",
    height: 20,
    width: 20,
    bottom: -5,
    left: -5,
    backgroundColor: theme.palette.background.default,
    display: "inline-block",
    borderRadius: "50%",
    cursor: "grab"
  },
  label: {
    position: "absolute",
    whiteSpace: "nowrap",
    left: "1.5rem"
  }
});


class Slider extends React.Component {
  state = {position: 100, value: null};
  direction = "Left";
  lowerDirection = "left";
  marginDirection = "bottom";
  measurement = "Width";
  coord = "X";
  posAdj = 0;

  constructor(props) {
      super(props);
      const { orient, lowerDirection } = props;
      this.track = React.createRef();
      this.slider = React.createRef();
      if (lowerDirection === "right") {
        this.lowerDirection = "right";
        this.posAdj = 1;
      }
      this.lowerDirection = (lowerDirection === "right") ? "right" : "left";
      if (props.orient === "vertical") {
        this.marginDirection = "Right"
        this.direction = "Top";
        this.measurement = "Height";
        this.coord = "Y";
        this.lowerDirection = "bottom";
        this.posAdj = 1;
        if (lowerDirection === "top") {
          this.lowerDirection = "top";
          this.posAdj = 0;
        }
      }
  }

  componentDidMount() {
    this.size = this.track.current[`offset${this.measurement}`];
  }

  getPosition = (pos) => {
    let offset = this.track.current[`offset${this.direction}`];
    let size = this.size;
    let position = Math.min(Math.max(pos - offset, 0) / size, 1);
    return Math.abs(this.posAdj - position);
  };

  setPosition = (position) => {
    const { handlePositionChange } = this.props;
    let { new_position, value } = handlePositionChange(position);
    position = ((new_position !== undefined) ? new_position : position) * 100;
    this.setState({position, value});
  };

  throttleDrag = throttle((position) => {
      this.setPosition(position);
  }, 100);

  handleDrag = (event) => {
    let pos = event[`page${this.coord}`];
    if (pos > 0) {
      let position = this.getPosition(pos);
      if (Math.abs(position * 100 - this.state.position) > 1) {
        this.slider.current.style[this.lowerDirection] = `calc(${position * 100}% - 10px)`;
        this.throttleDrag(position);
      }
    }
  };

  handleClick = (event) => {
    let pos = event[`page${this.coord}`];
    if (pos > 0) {
      this.setPosition(this.getPosition(pos));
    }
  };

	render() {
		const { classes, startingPosition, startValue } = this.props;
    let { position, value } = this.state;
    /*let position = (startingPosition !== undefined) ? startingPosition : 100;*/

    let styles = {};
    styles[this.lowerDirection] = `calc(${position}% - 10px)`;
		return (
        <div onClick={this.handleClick} ref={this.track} style={{[this.measurement.toLowerCase()]: '100%', [`margin${this.marginDirection}`]: '6rem'}} className={classes.track}>
          <span ref={this.slider} style={styles} draggable={true} className={classes.slider} onDrag={this.handleDrag}>
            <Typography className={classes.label} variant="body1">{value || startValue}</Typography> 
          </span>
        </div>
		);
	}
}

export default withStyles(styles)(Slider);