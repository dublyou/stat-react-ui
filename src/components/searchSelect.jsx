import React from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import SearchBar from './searchBar';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  
});

class SearchSelect extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  render() {
    const { classes, searches } = this.props;

    return (
      <div>
        <SearchBox search_box={searches[this.state.value]}/>
        <Select
            native
            value={this.state.value}
            onChange={this.handleChange}
        >
          {searches.map((value, i) => <option value={i}>{value.label}</option>)}
        </Select>
      </div>
    );
  }
}

SearchSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchSelect);