import React from 'react';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';

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
  <TextField
      className={classes.formControl}
      label="react-number-format"
      value={numberformat}
      onChange={this.handleChange('numberformat')}
      id="formatted-numberformat-input"
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
    />
}

function toTitleCase(str) {
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function get_sign(txt) {
    var return_val = "";
    if (txt.substr(0, 1) == "g") {
        return_val += ">";
    } else if (txt.substr(0, 1) == "l") {
        return_val += "<";
    }
    if (txt.slice(-1) == "e") {
        return_val += "=";
    }
    return return_val;
}

function toCurrency(x) {
    var dec_split = x.toString().split("."),
        currency = "$",
        len_b4_dec = dec_split[0].length,
        remainder = len_b4_dec % 3,
        num_commas;
    if (remainder > 0) {
        num_commas = Math.floor(len_b4_dec/3);
        currency += dec_split[0].substr(0, remainder);
    } else {
        num_commas = (len_b4_dec/3) - 1;
        currency += dec_split[0].substr(0, 3);
    }
    for (var i = 0; i < num_commas; i++) {
        currency += "," + dec_split[0].substr(remainder + i * 3, 3);
    }
    if (dec_split.length > 1) {
        currency += "." + dec_split[1];
    }
    return currency;
}

function render_func(params) {
    var type = params.type,
        func;

    var parse_vars = function (string, data, type, row) {
        var regex = /{{\s*(data|type|row)(?:.(\w+))?\s*}}/g,
            matches = string.match(regex),
            return_string = string;

        for (var i = 0; i < matches.length; i++) {
            var capture =  matches[i].match(/^{{\s*(data|type|row)(?:.(\w+))?\s*}}$/)
            switch (capture[1]) {
                case "data":
                    return_string.replace(matches[i], data);
                    break;
                case "row":
                    return_string.replace(matches[i], row[capture[2]])
                    break;
                case "type":
                    return_string.replace(matches[i], type);
                    break;
            }

        }
        return return_string;
    };
    switch(type) {
        case "html":
            func = function ( data, type, row ) {
                let { element, text, before, after, attrs } = params
                var attr_str = "",
                    inner_text = text || "",
                    after_text = after || "";
                    before_text = before || "";
                element = element || "div";

                for (var attr in attrs) {
                    if (attrs.hasOwnProperty(attr)) {
                        attr_str += attr + '="' + attrs[attr] + '" '
                    }
                }
                var string = `${before_text}<${element} ${attr_str}>${inner_text}</${element}>${after_text}`, /*'<' + element + attr_str + '>' + inner_text + '</' + element + '>' + after_text,*/
                    regex = /{{\s*(data|type|row)(?:.(\w+))?\s*}}/g,
                    matches = string.match(regex),
                    return_string = string;

                for (var i = 0; i < matches.length; i++) {
                    var capture =  matches[i].match(/^{{\s*(data|type|row)(?:.(\w+))?\s*}}$/)
                    switch (capture[1]) {
                        case "data":
                            return_string = return_string.replace(matches[i], data);
                            break;
                        case "row":
                            return_string = return_string.replace(matches[i], row[capture[2]])
                            break;
                        case "type":
                            return_string = return_string.replace(matches[i], type);
                            break;
                    }

                }
                return return_string;
            };
            break;
        case "percent":
            var decimal_places = params.decimal_places || 0;
            func =  function ( data, type, row ) {
                if (typeof data !== undefined && data !== null && data !== "N/A") {
                    return Number(Math.round(data+'e' + decimal_places)+'e-' + decimal_places) + "%";
                } else {
                    return "";
                }
            };
            break;
        case "currency":
            var decimal_places = params.decimal_places || 0;
            func = function(data, type, row) {
                if (typeof data !== undefined && data !== null && data !== "N/A") {
                    if (data < .01) {
                        data = Number(Math.round(data+'e6')+'e-6');
                    } else if (data < 1) {
                        data = Number(Math.round(data+'e4')+'e-4');
                    } else {
                        data = Number(Math.round(data+'e2')+'e-2');
                        data = data.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    }
                    return "$" + data;
                } else {
                    return "";
                }
            };
            break;
        case "number":
            var decimal_places = params.decimal_places || 0;
            func = function(data, type, row) {
                if (typeof data !== undefined && data !== null && data !== "N/A") {
                    return Number(Math.round(data+'e'+decimal_places)+'e-'+decimal_places);
                } else {
                    return "";
                }
            };
            break;
    }
    return func;
}

function create_renders(columns) {
    for(var i = 0; i < columns.length; i++) {
        if (columns[i].hasOwnProperty("render")) {
            columns[i].render = render_func(columns[i].render);
        }
        if (columns[i].hasOwnProperty("createdCell")) {
            columns[i].createdCell = function (td, cellData, rowData, row, col) {
                 if ( cellData < 0 ) {
                    $(td).css('color', 'red')
                 } else if ( cellData > 0 ) {
                     $(td).css('color', 'green')
                 }

            };
        }
    }
    return columns;
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  tableRow: {
    height: 30,
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.grey[700],
    },
  },
  tableCell: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

class FilterBox extends React.Component {
    state = {
        open: false,
        selected: null,
    };

    handleChange = (event) => {
        const { filterChange } = this.props
        let value = event.target.value;
        let id = event.target.getAttribute("id");
        filterChange(id, value);
        this.setState({
            open: true,
            selected: value,
        })
    };

    handleClose = () => {
        this.setState({
            open: false,
            selected: null,
        });
    };

    render() {
        const { filters, type } = this.props;
        let filter_ids = Object.keys(filters);
        
        if (type === "url") {
            return (
                <div>
                    {filter_ids.map((value) => {
                        return (
                            <FormControl>
                                <InputLabel htmlFor={value}>{toTitleCase(value)}</InputLabel>
                                <Select
                                onChange={filterChange}
                                inputProps={{
                                  name: value,
                                  id: value,
                                }}
                                >
                                    <MenuItem value="">
                                      <em>None</em>
                                    </MenuItem>
                                    {filters[value].options.map((option) => <MenuItem value={option || option.value}>{option.label || toTitleCase(option)}</MenuItem>)}
                                </Select>
                            </FormControl>
                        );
                    })}
                </div>
            );
        } else {
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
}

function compare(column, dir) {
  return function(a, b) {
	  if (a[column] < b[column])
	    return dir;
	  if (a[column] > b[column])
	    return -dir;
	  return 0;
	};
}

function filterData(row, id, operand, value) {
    let data = row[id];
    switch (operand ) {
        case ">":
            return data > value;
        case "<":
            return data < value;
        case "=":
            return data == value;
        case ">=":
            return data >= value;
        case "<=":
            return data <= value;
    }
}

class DataTable extends React.Component {
    constructor(props) {
        super(props);
        const { paginated, filters } = props;
        let filterValues = {};
        if (filters) {
            for (let f in filters.getOwnPropertyNames()) {
                filterValues[f] = filters[f].default || "";
            }
        }
        this.state = {
            sortDir: 1,
            filterValues: filterValues,
        };
        this.retrieveData();
    }

	sortData = (event) => {
		let value = event.target.getAttribute("id");
        let { filterValues, data, sortColumn, sortDir } = this.state;
		if (sortColumn == value) {
			this.setState({sortDir: -sortDir});
		} else {
			this.setState({sortDir: 1});
		}
        data = (this.props.paginated) ? this.retrieveData(filterValues, compare(value, this.state.sortDir)) : data.sort(compare(value, this.state.sortDir));
        this.setState({
            data: data,
            sortColumn: value,
        });
  	};

    filterChange = (id, value) => {
        let filters = this.state.filterValues;
        filters[id] = value;
        this.setState({
            filterValues: filters,
            data: this.retrieveData(),
        });
    };

    retrieveData = () => {
        const { getData, dataurl, paginated } = this.props;
        let { data, ordering } = this.props;
        let { filterValues, sortColumn, sortDir } = this.state;
        if (paginated) {
            data = getData(filterValues, compare(sortColumn, sortDir));
        } else if (dataurl !== undefined && data === undefined) {
            let url = dataurl;
            for (let f in filterValues) {
                url = url.replace("[=" + f + "=]", filterValues[f]);
            }
            axios.get(url).then(res => {
                data = res.data;
            });
        }
        ordering = ordering || Object.keys(data[0]);
        this.state.sortColumn = ordering[0];
        this.state.data = data;
        this.state.ordering = ordering;
    };

    getFilters = () => {
        const { filters, dataurl } = this.props;
        if (filters) {
            return <FilterBox filters={filters}/>;
        }
        return "";
    };

    getColumns = () => {
        let { renders } = this.props;
        let { data, ordering } = this.state;
        let columns = {};
        renders = renders || {};
        ordering = ordering || Object.getOwnPropertyNames(data[0]);
        for (let value of ordering) {
            columns[value] = {label: toTitleCase(value)};
            if (renders.hasOwnProperty(value)) {
                columns[value].render = renders[value];
            }
        }
        return create_renders(columns);
    };

	render() {
		const { classes, theme } = this.props;
		let columns = this.getColumns();
        let { data, ordering } = this.state;

		return (
		    <Paper className={classes.root}>
                {this.getFilters()}
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							{ordering.map((value, index) => <TableCell className={classes.tableCell} onClick={this.sortData} key={value} id={value} numeric>{columns[value].label}</TableCell>)}
						</TableRow>
					</TableHead>
					<TableBody>
					  {data.map((row, index) => {
					    return (
					      <TableRow className={classes.tableRow} key={index}>
					      	{ordering.map((value, index2) => <TableCell className={classes.tableCell} key={index2*index + index2} numeric>{(columns[value].hasOwnProperty("render") ? columns[value].render(row[value], "", row) : row[value])}</TableCell>)}
					      </TableRow>
					    );
					  })}
					</TableBody>
				</Table>
		    </Paper>
		);
	}
}

export default withStyles(styles, { withTheme: true })(DataTable);
