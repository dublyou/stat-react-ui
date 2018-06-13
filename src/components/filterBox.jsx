import React from 'react';
import NumberFormat from 'react-number-format';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
  const { inputRef, onChange, ...other } = props;

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
      thousandSeparator
      prefix="$"
    />
  );
  /*<TextField
      className={classes.formControl}
      label="react-number-format"
      value={numberformat}
      onChange={this.handleChange('numberformat')}
      id="formatted-numberformat-input"
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />*/
}

class FilterBox extends React.Component {
    state = {
        open: false,
        selected: null,
    };

    handleChange = (id) => (event) => {
        const { filterChange } = this.props
        let value = event.target.value;
        filterChange(id, value);
        /*this.setState({
            open: true,
            selected: value,
        })*/
    };

    handleClose = () => {
        this.setState({
            open: false,
            selected: null,
        });
    };

    render() {
        const { classes, filters, filterValues } = this.props;
        let filter_ids = Object.keys(filters);
        return (
            <div className={classes.root}>
                {filter_ids.map((value, i) => {
                    return (
                        <FormControl key={i} className={classes.formControl}>
                            <InputLabel htmlFor={value}>{toTitleCase(value)}</InputLabel>
                            <Select
                            onChange={this.handleChange(value)}
                            inputProps={{
                              name: value,
                              value: filterValues[value],
                            }}
                            >
                                {filters[value].options.map((option) => <MenuItem value={option || option.value}>{option.label || toTitleCase(option)}</MenuItem>)}
                            </Select>
                        </FormControl>
                    );
                })}
            </div>
        );
        return (
            <div>
                <FormControl>
                    <InputLabel htmlFor="filter-select">Filters</InputLabel>
                    <Select
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'filter-select',
                      id: 'filter-select',
                    }}
                    >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {filter_ids.map((value) => <MenuItem value={value}>{filters[value] || toTitleCase(value)}</MenuItem>)}
                    </Select>
                </FormControl>
                <Dialog
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">New Filter</DialogTitle>
                    <DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={this.handleClose} color="primary">
                          Add Filter
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(FilterBox);