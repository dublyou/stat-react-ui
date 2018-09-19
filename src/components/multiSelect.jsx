import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import toTitleCase from '../utils/toTitleCase';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
});

class MultiSelect extends React.Component {
  state = {
    fields: [],
  };

  render() {
    const { classes, possibleFields, selectedFields, label, handleChange } = this.props;

    return (
        <FormControl className={classes.formControl}>
            <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
            <Select
                multiple
                value={selectedFields}
                onChange={handleChange}
                input={<Input id={`select-multiple-checkbox-${label}`} />}
                renderValue={selected => selected.map(value => toTitleCase(value)).join(', ')}
            >
                {possibleFields.map(name => (
                <MenuItem key={name} value={name}>
                    <Checkbox checked={selectedFields.indexOf(name) > -1} />
                    <ListItemText primary={toTitleCase(name)} />
                </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
  }
}

export default withStyles(styles)(MultiSelect);



