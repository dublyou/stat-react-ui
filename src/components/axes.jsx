import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { extent as d3extent, sum as d3sum, max as d3max, min as d3min } from 'd3-array';
import { nest as d3nest} from 'd3-collection';

const styles = theme => ({
  root: {
    position: "absolute",
    borderColor: theme.palette.text.secondary,
    
  },
  label: {
    position: "absolute",
    whiteSpace: "nowrap",
  },
  tickMark: {
    position: "absolute",
  },
  tickMarkLine: {
    stroke: theme.palette.text.secondary,
    strokeWidth: 2,
  },
  tickMarkLabel: {
    position: "absolute",
  }
});


function titleCase(str) {
  str = str.toLowerCase();
  str = str.split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

class Axes extends React.Component {

	render() {
		const { classes, type="horizontal", position, range, offset=0, axisLabelName, scaleAdj=1 } = this.props;
    let { step=2 } = this.props;
    let styles = {};
    let labelStyles = {};
    let axisLabel = (axisLabelName !== undefined) ? <Typography style={labelStyles} className={classes.label} variant="body1">{axisLabelName}</Typography> : null;
    let tickProps = {};
    let axisValue = (type === "vertical") ? 1 : 0;
    let positionValue = ((axisValue === 1 && position === "right") || (axisValue === 0 && position === "top")) ? 1 : 0;
    let dims = ["x", "y"];
    let dirs = [["left", "right"], ["bottom", "top"]];
    let measures = ["width", "height"];

    for (let dir of dirs[axisValue]) {
      styles[dir] = 0;
    }
    styles[`border${titleCase(dirs[Math.abs(axisValue - 1)][positionValue])}Width`] = "1px";
    styles[`border${titleCase(dirs[Math.abs(axisValue - 1)][positionValue])}Style`] = "solid";
    styles[dirs[Math.abs(axisValue - 1)][positionValue]] = `-${offset}rem`;
    if (axisValue === 1) {
      labelStyles.transform = `rotate(${-90 + (360 * positionValue)}deg)`;
    }
    labelStyles[dirs[Math.abs(axisValue - 1)][positionValue]] = `-${offset + 2.75}rem`;
    labelStyles[dirs[axisValue][positionValue]] = "50%";
    tickProps = {[measures[axisValue]]: "100%", [measures[Math.abs(axisValue - 1)]]: ".5rem"}

    let tickMarks = [];
    let tickLabels = [];
    let lineProps = {x1: 0, y1: 0, x2: ".5rem", y2: ".5rem"};
    let start = Math.ceil(range[0] / 2) * 2;
    for (let i = start; i <= range[1]; i += step) {
      let perc = (1 - (i - range[0])/(range[1] - range[0])) * 100 * scaleAdj + (1 - scaleAdj) * 100;
      lineProps[`${dims[axisValue]}1`] = `${100 - perc}%`;
      lineProps[`${dims[axisValue]}2`] = `${100 - perc}%`;
      tickMarks.push(<line key={i} {...lineProps} className={classes.tickMarkLine}/>);
      if (i % (step * 2) === 0) {
        let tickLabelStyles = {[dirs[axisValue][Math.abs(positionValue - 1)]]: `calc(${perc}% - .5rem`, [dirs[Math.abs(axisValue - 1)][positionValue]]: "-1.75rem"};
        tickLabels.push(<Typography key={i} style={tickLabelStyles} className={classes.tickMarkLabel}>{i}</Typography>);
      }
    }

		return (
        <div style={styles} className={classes.root}>
          <svg className={classes.tickMark} {...tickProps} style={{[dirs[Math.abs(axisValue - 1)][positionValue]]: "-.5rem"}}>{tickMarks}</svg>
          {tickLabels}
          {axisLabel}
        </div>
		);
	}
}

export default withStyles(styles)(Axes);