import React from 'react';
import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    root: {
        display: "flex"
    },
    formControl: {
    	minWidth: 60
    }
});

function toTitleCase(str) {
    str = "" + str;
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function NumberFormatCustom(props) {
  const { type, inputRef, onChange, ...other } = props;
  let format_props = {};
  if (type === "percent") {
    format_props.suffix = "%";
  } else if (type === "currency") {
    format_props = {prefix: "$ ", thousandSeparator: true};
  }

  return (
    <NumberFormat
      {...other}
      ref={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      {...format_props}
    />
  );
}

class FilterBox extends React.Component {
    state = {
        open: false,
        selected: null,
    };

    handleChange = (id) => (event) => {
        const { filterChange } = this.props;
        let value = event.target.value;
        filterChange(id, value);
    };

    addFilter = (id) => (event) => {
      const { filterChange } = this.props;
      const { selected } = this.state;
      let value = document.getElementById("filterValue").value;
      let direction = document.getElementById("filterDirection").value;
      filterChange(`${selected}__${direction}`, value);
      this.setState({
          open: false,
          selected: null,
      });
    };

    removeFilter = (id) => () => {
      const { filterChange } = this.props;
      filterChange(id, null);
    };

    handleFilterSelect = (event) => {
        let value = event.target.value;
        if (value) {
          this.setState({
            open: true,
            selected: value,
        });
        }
    };

    handleClose = () => {
        this.setState({
            open: false,
            selected: null,
        });
    };

    render() {
        const { classes, filters, filterValues, renders } = this.props;
        let filter_ids = Object.keys(filters);
        let dataFilters = filter_ids.filter((id) => filters[id].type === "data");
        let filterSelect = null;
        if (dataFilters.length > 0) {
          filterSelect = (
              <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="filterSelect">Filters</InputLabel>
                  <select onChange={this.handleFilterSelect} name='filterSelect' id='filterSelect'>
                      <option value="" selected={this.state.selected === null}>Choose a filter</option>
                      {dataFilters.map((value) => <option value={value} selected={this.state.selected === value}>{filters[value] || toTitleCase(value)}</option>)}
                  </select>
                   <Dialog
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle id="form-dialog-title">New Filter</DialogTitle>
                      <DialogContent>
                        <FormControl className={classes.formControl}>
                            <InputLabel>{toTitleCase(this.state.selected)}</InputLabel>
                            <Select
                            onChange={this.handleFilterSelect}
                            inputProps={{
                              value: "",
                              id: "filterDirection"
                            }}
                            >
                                {[">", "<", ">=", "<=", "="].map((option) => <MenuItem value={option}>{toTitleCase(option)}</MenuItem>)}
                            </Select>
                            <TextField
                              id="filterValue"
                              type={renders[this.state.selected].type}
                              InputProps={{
                                inputComponent: NumberFormatCustom,
                              }}
                            />
                        </FormControl>
                      </DialogContent>
                      <DialogActions>
                          <Button onClick={this.handleClose} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={this.addFilter} color="primary">
                            Add Filter
                          </Button>
                      </DialogActions>
                    </Dialog>
              </FormControl>
          );
        }
        return (
            <div className={classes.root}>
                {filter_ids.map((value, i) => {
                  if (filters[value].type === "url") {
                    return (
                        <FormControl key={i} className={classes.formControl}>
                            <InputLabel htmlFor={value}>{filters[value].label || toTitleCase(value)}</InputLabel>
                            <Select
                            onChange={this.handleChange(value)}
                            inputProps={{
                              name: value,
                              value: filterValues[value],
                            }}
                            >
                                {filters[value].options.map((option) => <MenuItem key={option || option.value} value={option || option.value}>{option.label || toTitleCase(option)}</MenuItem>)}
                            </Select>
                        </FormControl>
                    );
                  }
                })}
                {filter_ids.map((value, i) => {
                  if (filters[value].type === "select") {
                    return (
                        <FormControl key={i} className={classes.formControl}>
                            <InputLabel htmlFor={value}>{filters[value].label || toTitleCase(value)}</InputLabel>
                            <Select
                              onChange={this.handleChange(value)}
                              value={filterValues[value]}
                              inputProps={{
                                name: value,
                              }}
                            >
                                <MenuItem value="null">All</MenuItem>
                                {filters[value].options.map((option) => <MenuItem value={option.value || option}>{option.label || toTitleCase(option)}</MenuItem>)}
                            </Select>
                        </FormControl>
                    );
                  }
                })}
                {filterSelect}
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(FilterBox);