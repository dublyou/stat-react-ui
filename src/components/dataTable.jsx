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
                var attr_str = " ",
                    element = params.element || "div",
                    inner_text = params.text || "",
                    after_text = params.after || "",
                    attrs = params.attrs;

                for (var attr in params.attrs) {
                    if (params.attrs.hasOwnProperty(attr)) {
                        attr_str += attr + '="' + params.attrs[attr] + '" '
                    }
                }
                var string = '<' + element + attr_str + '>' + inner_text + '</' + element + '>' + after_text,
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
            if (decimal_places === "vary") {
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
            } else {
                func = $.fn.dataTable.render.number( ',', '.', decimal_places, '$' );
            }
            break;
        case "number":
            var decimal_places = params.decimal_places || 0;
            func = $.fn.dataTable.render.number( ',', '.', decimal_places);
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
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

const sample_data = [
	{"player_id": 1630, "player_first_name": "Tim", "player_last_name": "Hardaway", "season_year": 2014, "season_league": 0, "team_id": 63, "team_name": "New York Knicks", "team_abbrev": "NYK", "assists_AST": 0.8148, "blocks_BLK": 0.0864, "field_goal_attempts_FGA": 8.4815, "field_goals_FG": 3.6296, "free_throw_attempts_FTA": 1.5802, "free_throws_FT": 1.3086, "points_PTS": 10.1728, "rebounds_REB": 1.4938, "steals_STL": 0.5432, "three_point_attempts_3PA": 4.4198, "three_pointers_3P": 1.6049, "turnovers_TOV": 0.5802, "field_goal_percentage_FG%": 0.4279, "three_point_percentage_3P%": 0.3631, "free_throw_percentage_FT%": 0.8281}, 
	{"player_id": 1630, "player_first_name": "Tim", "player_last_name": "Hardaway", "season_year": 2015, "season_league": 0, "team_id": 63, "team_name": "New York Knicks", "team_abbrev": "NYK", "assists_AST": 1.8143, "blocks_BLK": 0.2, "field_goal_attempts_FGA": 10.2429, "field_goals_FG": 3.9857, "free_throw_attempts_FTA": 2.2286, "free_throws_FT": 1.7857, "points_PTS": 11.4857, "rebounds_REB": 2.2286, "steals_STL": 0.2857, "three_point_attempts_3PA": 5.0571, "three_pointers_3P": 1.7286, "turnovers_TOV": 1.1714, "field_goal_percentage_FG%": 0.3891, "three_point_percentage_3P%": 0.3418, "free_throw_percentage_FT%": 0.8013}, 
	{"player_id": 1630, "player_first_name": "Tim", "player_last_name": "Hardaway", "season_year": 2016, "season_league": 0, "team_id": 1, "team_name": "Atlanta Hawks", "team_abbrev": "ATL", "assists_AST": 0.9667, "blocks_BLK": 0.1333, "field_goal_attempts_FGA": 4.85, "field_goals_FG": 2.0167, "free_throw_attempts_FTA": 1.0333, "free_throws_FT": 0.9, "points_PTS": 5.7667, "rebounds_REB": 1.5833, "steals_STL": 0.35, "three_point_attempts_3PA": 2.6, "three_pointers_3P": 0.8333, "turnovers_TOV": 0.4333, "field_goal_percentage_FG%": 0.4158, "three_point_percentage_3P%": 0.3205, "free_throw_percentage_FT%": 0.871}, 
	{"player_id": 1630, "player_first_name": "Tim", "player_last_name": "Hardaway", "season_year": 2017, "season_league": 0, "team_id": 1, "team_name": "Atlanta Hawks", "team_abbrev": "ATL", "assists_AST": 2.2235, "blocks_BLK": 0.1765, "field_goal_attempts_FGA": 11.6941, "field_goals_FG": 5.2, "free_throw_attempts_FTA": 2.7412, "free_throws_FT": 2.0706, "points_PTS": 14.3529, "rebounds_REB": 2.8235, "steals_STL": 0.6824, "three_point_attempts_3PA": 5.4, "three_pointers_3P": 1.8824, "turnovers_TOV": 1.3647, "field_goal_percentage_FG%": 0.4447, "three_point_percentage_3P%": 0.3486, "free_throw_percentage_FT%": 0.7554}
];


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
        let filter_ids = filters.getOwnPropertyNames();
        
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
        for (let f in filters.getOwnPropertyNames()) {
            filterValues[f] = filters[f].default || "";
        }
        this.state = {
            sortDir: 1,
            filterValues: filterValues,
        };
        this.retrieveData();
    }

	sortData = (event) => {
		let value = event.target.getAttribute("id");
		if (this.state.sortColumn == value) {
			this.setState({sortDir: -this.state.sortDir});
		} else {
			this.setState({sortDir: 1});
		}
        let data = (this.props.paginated) ? this.retrieveData() : this.state.tableData.sort(compare(value, this.state.sortDir));
        this.setState({
            tableData: data,
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
        } else if (dataurl !== undefined) {
            let url = dataurl;
            for (let f in filterValues) {
                url = url.replace("[=" + f + "=]", filterValues[f]);
            }
            axios.get(url).then(res => {
                data = res.data;
            });
        }
        ordering = ordering || data[0].getOwnPropertyNames();
        this.setState({
            sortColumn: ordering[0],
            tableData: data,
            ordering: ordering,
        });
    };

    getFilters = () => {
        const { filters, dataurl } = this.props;
        let type = (dataurl === undefined) ? "all" : "url";
        return <FilterBox filters={filters}/>;
    };

    getColumns = () => {
        let { columns } = this.props;
        let { tableData, ordering } = this.state;
        let renders = {};
        if (columns !== undefined) {
            for (let c in columns) {
                columns[c].label = columns[c].label || toTitleCase(columns[c].id);
                visible = columns[c].visible;
                if (visible === undefined || visible) {
                    renders[c] = columns[c];
                    if (ordering.indexOf(c)) {
                        ordering.push(c);
                    }
                }
            }
        } else {
            let visibleColumns = Object.getOwnPropertyNames(tableData[0]);
            for (let value of visibleColumns) {
                renders[value] = {label: toTitleCase(value)};
            }
        }
        this.setState({ordering: ordering});
        return create_renders(renders);
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
							{ordering.map((value, index) => <TableCell onClick={this.sortData} key={value} id={value} numeric>{columns[value].label}</TableCell>)}
						</TableRow>
					</TableHead>
					<TableBody>
					  {data.map((row, index) => {
					    return (
					      <TableRow key={index}>
					      	{ordering.map((value, index2) => <TableCell key={index} numeric>{(columns[value].hasOwnProperty("render") ? columns[value].render(row[value], "", row) : row[value])}</TableCell>)}
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
