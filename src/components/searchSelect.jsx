import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SearchBar from './searchBar';

const styles = theme => ({
  root: {
    display: "flex",
  },
  container: {
    borderRadius: "0 4px 4px 0",
    backgroundColor: theme.palette.background.paper,
    "&:before": {
        borderBottom: "none !important",
    },
    "&:after": {
        borderBottom: "none !important",
    }
  },
  selectRoot: {
    margin: "auto 8px",
  },
  select: {

  },
});

class SearchSelect extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  getSearchBar = (value) => {
    const { searches } = this.props;
    return <SearchBar {...searches[value]}/>;
  };

  render() {
    const { classes, searches } = this.props;
    

    return (
      <div className={classes.root}>
        {this.getSearchBar(this.state.value)}
        <Select
            value={this.state.value}
            onChange={this.handleChange}
            className={classes.container}
            classes={{root: classes.selectRoot}}
        >
          {searches.map((value, i) => <MenuItem key={i} value={i}>{value.label}</MenuItem>)}
        </Select>
      </div>
    );
  }
}

SearchSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchSelect);