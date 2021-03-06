import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
    formLabel: {
        zIndex: 2,
    },
    formControl: {
        width: '100%',
    },
    select: {
        paddingTop: theme.spacing.unit * 2.5,
        paddingBottom: theme.spacing.unit,
    },
    shrink: {
        marginTop: theme.spacing.unit
    }
});

class SelectControl extends React.Component {
    handleChange = (e) => {
        const { onChange } = this.props;
        onChange(e, e.target.value);
    }

    render() {
        const { classes, label, options, value, maxWidth } = this.props;
        return (
            <FormControl className={classes.formControl} variant="outlined" style={{maxWidth: maxWidth}}>
                <InputLabel
                    className={classes.formLabel}
                    ref={ref => {
                        this.InputLabelRef = ref;
                    }}
                    classes={{shrink: classes.shrink}}
                >
                    {label}
                </InputLabel>
                <Select
                    value={value}
                    onChange={this.handleChange}
                    input={
                        <OutlinedInput
                            labelWidth={0}
                            fullWidth={true}
                        />
                    }
                    classes={{select: classes.select}}
                >
                    {options.map(option => {
                        return (
                            <MenuItem key={option.value} value={option.value}>
                                <ListItemText primary={option.label}/>
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    }
}

export default withStyles(styles)(SelectControl);