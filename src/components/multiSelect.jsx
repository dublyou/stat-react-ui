import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { toTitleCase } from '../utils/helpers';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  formHelper: {
    display: 'flex',
  },
  helper: {
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.primary.main,
      cursor: 'pointer',
    }
  }
});

class MultiSelect extends React.Component {
  state = {
    multiple: true,
  };

  getRanges = (selected, fields) => {
    let lbound = null;
    let ubound = null;
    let ranges = [];
    fields = fields.sort(function(a, b) {
      return a - b;
    });
    for (let i = 0; i < fields.length; i++) {
      let value = fields[i];
      let inSelected = selected.indexOf(value) !== -1;
      if (inSelected) {
        lbound = lbound || value;
        if (lbound !== value) {
          ubound = value;
        }
      }
      if (!inSelected || i + 1 === fields.length) {
        if (lbound && ubound) {
          ranges.push(`${lbound}-${ubound}`);
        } else if (lbound !== null) {
          ranges.push(lbound);
        }
        lbound = null;
        ubound = null;
      }
    }
    return ranges;
  };

  getSelectedDisplay = (selected) => {
    const { possibleFields, continuous=false } = this.props;
    if (selected.length === possibleFields.length && selected.length > 0) {
      return 'All' + (continuous ? ` (${this.getRanges(selected, possibleFields)})` : '');
    } else if (selected.length > 1) {
      let display = continuous ? this.getRanges(selected, possibleFields) : selected;
      return display.map(value => toTitleCase(value)).join(', ');
    } else {
      return selected;
    }
  };

  handleClear = (e) => {
    const { handleChange } = this.props;
    handleChange(e, []);
  };

  handleMultiChange = (e) => {
    const { multiple } = this.state;
    const { handleChange, selectedFields } = this.props;
    if (multiple) {
      handleChange(e, selectedFields[0]);
    }
    this.setState({multiple: !multiple});
  };

  render() {
    const { classes, possibleFields, selectedFields, label, handleChange } = this.props;
    const { multiple } = this.state;

    return (
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-checkbox">{toTitleCase(label)}</InputLabel>
            <Select
                multiple={multiple}
                value={selectedFields}
                onChange={handleChange}
                input={<Input id={`select-multiple-checkbox-${label}`} />}
                renderValue={this.getSelectedDisplay}
            >
                {possibleFields.map(name => (
                <MenuItem key={name} value={name}>
                    {multiple ? <Checkbox checked={selectedFields.indexOf(name) > -1} /> : null}
                    <ListItemText primary={toTitleCase(name)} />
                </MenuItem>
                ))}
            </Select>
            <FormHelperText className={classes.formHelper}>
              <span style={{flex: 1}} className={classes.helper} onClick={this.handleMultiChange}>{multiple ? 'Single Select': 'Multi Select'}</span>
              <span style={{flex: 1, textAlign: 'right'}} className={classes.helper} onClick={this.handleClear}>Clear</span>
            </FormHelperText>
        </FormControl>
    );
  }
}

export default withStyles(styles)(MultiSelect);



