import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Radio from '@material-ui/core/Radio';
import { toTitleCase } from '../utils/helpers';
import union from 'lodash/union';
import pullAll from 'lodash/pullAll';

const styles = theme => ({
    root: {
    },
    formLabel: {
        width: '100%',
        margin: 0,
    },
    menuItem: {
        padding: '.5rem',
    },
  });
  
  class SelectMenu extends React.Component {
        state = {
            selected: [],
        };

        handleSelectAllClick = (selected) => () => {
            const { handleChange=null, options } = this.props;
            selected = union(selected, options);
            if (handleChange) {
                handleChange(selected);
            }
            this.setState({selected});
        }

        handleClearAllClick = (selected) => () => {
            const { handleChange=null, options } = this.props;
            selected = pullAll(selected, options);
            if (handleChange) {
                handleChange(selected);
            }
            this.setState({selected});
        }
  
        handleChange = (selected) => (event) => {
            const { handleChange=null, multiple=true } = this.props;
            if (multiple) {
                if (event.target.checked) {
                    selected.push(event.target.value);
                } else {
                    selected.splice(selected.indexOf(event.target.value), 1);
                }
            } else {
                selected = [event.target.value];
            }
            if (handleChange) {
                handleChange(selected);
            }
            this.setState({selected});
        };

        getControlButtons = (selected) => {
            return (
                <div style={{textAlign: 'center'}}>
                    <Button size='small' color='primary' onClick={this.handleSelectAllClick(selected)}>Select All</Button>
                    <Button size='small' color='primary' onClick={this.handleClearAllClick(selected)}>Clear All</Button>
                </div>
            )
        }

        render() {
            const { classes, options, multiple=true, selected=[] } = this.props;
            const ControlComponent = multiple ? Checkbox : Radio;
            const controls = multiple ? this.getControlButtons(selected) : null;
            return (
                <div>
                    {controls}
                    <MenuList>
                        {options.map(option => {
                            return (
                                <MenuItem key={option} className={classes.menuItem}>
                                    <FormControlLabel
                                        control={<ControlComponent value={option} color="primary" checked={selected.indexOf(option) > -1} onChange={this.handleChange(selected)}/>}
                                        label={toTitleCase(option)}
                                        className={classes.formLabel}
                                    />
                                </MenuItem>
                            );
                        })}
                    </MenuList>
                </div>
            );
        }
  }
  
  export default withStyles(styles)(SelectMenu);