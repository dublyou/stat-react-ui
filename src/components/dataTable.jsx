import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import RootRef from '@material-ui/core/RootRef';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FilterBox from './filterBox';
import axios from 'axios';
import sample_data from '../sample_data/team_roster';

const getCombos = (group_by, groups, combos=[], count=0) => {
    let labels = group_by;
    if (labels.length === count) {
        return combos;
    }
    let newCombos = [];
    let label = labels[count];
    if (combos.length === 0) {

        newCombos = groups[label].map(value => {
            let obj = {};
            obj[label] = value;
            return obj;
        });
    } else {
        for (value of groups[label]) {
            for (combo of combos) {
                combo[label] = value;
                newCombos.push(combo);
            }
        }
    }
    return getCombos(labels, groups, newCombos, count + 1);
}

function toTitleCase(str) {
    str = "" + str;
    return str.replace(/_/g, " ").replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function get_sign(txt) {
    var return_val = "";
    if (txt.substr(0, 1) === "g") {
        return_val += ">";
    } else if (txt.substr(0, 1) === "l") {
        return_val += "<";
    }
    if (txt.slice(-1) === "e") {
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

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit,
        overflowX: 'auto',
        paddingBottom: 20,
        textAlign: "center",
    },
    table: {
        minWidth: 700,
        width: "auto",
    },
    tableHeadRow: {
        height: 30,
        transform: "none",

    },
    tableHead: {
        transform: "none",
    },
    tableRow: {
        height: 30,
        backgroundColor: theme.palette.grey[100],
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.grey[300],
        },
        '&:hover': {
            backgroundColor: theme.palette.grey[400],
            cursor: "pointer",
        }
    },
    tableCell: {
        padding: 10,
        textAlign: "left",
        maxWidth: 100,
        backgroundColor: theme.palette.background.default,
        "&:hover": {
            cursor: "pointer",
            backgroundColor: theme.palette.grey[900],
            color: theme.palette.primary.main,
        }
    },
    tableBodyCell: {
        color: theme.palette.grey[600],
        paddingLeft: 10,
        paddingRight: 10,
        borderBottom: "1px solid #fff",
        textAlign: "left",
        maxWidth: 150,
    },
    tableBodyHead: {
        position: "absolute",
        left: 0,
        top: "auto",

    },
    groupContainer: {
        margin: 10,
        display: "inline-block",
        margin: "0 auto",
    },
    groupHeader: {
        minHeight: 20,
        padding: 5,
    },
    groupTitle: {
        fontSize: 16,
        color: "#ddd",
    },
    tableContainer: {
        display: "flex",
        flexWrap: "wrap",
    },
    button: {
        color: "#0066ff",
        fontSize: 11,
        padding: 2,
        textAlign: "left",
        justifyContent: "initial",
        minHeight: 16,
        position: "static"
    },
    buttonLabel: {
        textTransform: 'capitalize',
    },
    container: {
        maxHeight: 400,
        maxWidth: 1000,
        width: "100%",
        overflow: "auto",
        display: "inline-block"

    }
});

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
    switch (operand) {
        case ">":
            return data > value;
        case "<":
            return data < value;
        case "=":
            return data === value;
        case ">=":
            return data >= value;
        case "<=":
            return data <= value;
        default:
            return false;
    }
}

class DataTable extends React.Component {
    state = {
        sortDir: 1,
        ordering: [],
        references: {},
        data: [],
        group_by: [],
        groups: {},
        columns: {},
        perPage: 10,
        page: 0,
    };

    constructor(props) {
        super(props);
        this.tableContainer = React.createRef();
        
    }

    componentWillMount() {
        let { perPage } = this.props;
        this.setState({
            perPage: perPage || 10,
        });
        this.getData();
    };

    getData = (filterValues) => {
        let { data, url, groups, filters } = this.props;
        let state_data = this.state.data;
        if (filters !== undefined && filterValues === undefined) {
            filterValues = {};
            for (let f in filters) {
                filterValues[f] = filters[f].default || "";
            }
            this.setState({filterValues})
        }
        filterValues = filterValues || {};
        for (let f in filterValues) {
            if (filters[f].type === url) {
                url = url.replace("[=" + f + "=]", filterValues[f]);
            }
        }
        if (url !== undefined) {
            axios.get(url).then(res => {
                return res.data;
            }).catch(error => {
                return (state_data.length > 0) ? state_data : data;
            }).then(data => {
                this.setData(data);
            });
        } else {
            data = (state_data.length > 0) ? state_data : data;
            this.setData(data);
            
        }
    };

    setData = (data) => {
        let { groups, ordering, sortColumn, sortDir } = this.props;
        ordering = ordering || Object.keys(data[0]);
        sortColumn = sortColumn || ordering[0];
        sortDir = sortDir || 1;
        this.setState({
            ordering,
        });
        this.getColumns();
        this.sortData(data, sortDir, sortColumn);
        if (groups !== undefined) {
            for (let group of groups) {
                this.getGroup(group);
            }
        }
    };

    sortData = (data, sortDir, sortColumn) => {
        this.setState({
            data: data.sort(compare(sortColumn, sortDir)),
            sortDir,
            sortColumn,
        });
    };

	handleSort = (value) => () => {
        value = this.getDataReference(value);
        let { sortColumn, sortDir, data } = this.state;
        sortDir = ((sortColumn === value) ? -sortDir : 1);
        this.sortData(data, sortDir, value);
        this.setState({page: 0});
  	};

    getDataReference = (id) => {
        let { references } = this.state;
        if (references.hasOwnProperty(id)) {
            return references[id];
        }
        return id;
    };

    getFilters = (filterValues) => {
        const { filters } = this.props;
        if (filters !== undefined) {
            return <FilterBox filters={filters} filterValues={filterValues} filterChange={this.filterChange}/>;
        }
        return null;
    };

    filterChange = (id, value) => {
        const { filters } = this.props;
        let { filterValues } = this.state;
        filterValues[id] = value;
        this.setState({
            filterValues: filterValues,
        });
        if (filters[value].type === "url") {
            this.getData(filterValues);
        }
    };

    getColumns = () => {
        let { renders, calculations, labels } = this.props;
        let { ordering, references } = this.state;
        let columns = {};
        renders = renders || {};
        calculations = calculations || {};
        labels = labels || {};
        for (let value of ordering) {
            columns[value] = {label: labels[value] || value};
            if (renders.hasOwnProperty(value)) {
                let render = renders[value];
                if (render.hasOwnProperty("reference")) {
                    references[value] = render["reference"];
                }
                columns[value].render = this.createRender(render);
            }
            if (calculations.hasOwnProperty(value)) {
                columns[value].calc = this.createCalc(calculations[value]);
            }
            if (columns[value].hasOwnProperty("createdCell")) {
                columns[value].createdCell = function (td, cellData, rowData, row, col) {
                     return td;
                };
            }
        }
        
        this.setState({
            columns,
            references,
        });
    };

    createCalc = params => {
        let { calc } = params;
        switch (calc) {
            case "ratio":
                let { num, dom } = params;
                func = (data, row) => (row[dom] > 0) ? row[num]/row[dom] : null;
            default:
                func = (data, row) => {return data;};
        }
        return func;
    };

    createRender = params => {
        const { classes } = this.props;
        let { type, decimal_places } = params;
        var func;
        decimal_places = decimal_places || 0;
        var parse_vars = function (string, data, type, row) {
            let regex = /{{\s*(?:data|type|row)(?:.(\w+))?\s*}}/g,
                matches = string.match(regex),
                return_string = string;
            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    var capture =  matches[i].match(/^{{\s*(data|type|row)(?:.(\w+))?\s*}}$/)
                    switch (capture[1]) {
                        case "data":
                            return_string = return_string.replace(matches[i], data);
                            break;
                        case "row":
                            return_string = return_string.replace(matches[i], row[capture[2]]);
                            break;
                        case "type":
                            return_string = return_string.replace(matches[i], type);
                            break;
                    }
                }
            }
            return return_string;
        };
        switch(type) {
            case "html":
                func = function ( data, type, row ) {
                    const { element, text, before, after, attrs } = params;
                    let props = {};
                    for (let attr in attrs) {
                        props[attr] = parse_vars(attrs[attr], data, type, row);
                    }
                    let texts = [before, text, after];
                    for (let i = 0; i < texts.length; i++) {
                        if (texts[i]) {
                            texts[i] = parse_vars(texts[i], data, type, row);
                        }
                    }
                    switch(element) {
                        case "a":
                            return <Button {...props} classes={{root: classes.button, label: classes.buttonLabel}} size="small" component="a">{texts[1].replace(/ /g, "\u00a0")}</Button>;
                        default:
                            return <div>{texts[0]}<span {...props}>{texts[1]}</span>{texts[2]}</div>;
                    }
                };
                break;
            case "percent":
                func = (data, type, row) => (typeof data !== undefined && data !== null && data !== "N/A") ? Number.parseFloat(data*100).toFixed(decimal_places) + "%" : "";
                break;
            case "currency":
                func = (data, type, row) => (typeof data !== undefined && data !== null && data !== "N/A") ? "$" + Number.parseFloat(data).toFixed(decimal_places) : "";
                break;
            case "number":
                func = (data, type, row) => (typeof data !== undefined && data !== null && data !== "N/A") ? Number.parseFloat(data).toFixed(decimal_places) : "";
                break;
            default:
                func = (data, type, row) => {return data;};
        }
        return func;
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ perPage: event.target.value });
    };

    handleTableScroll = () => {
        const { freeze } = this.props;
        const { data } = this.state;
        let translateTop = "translate(0," + this.tableContainer.current.scrollTop + "px)";
        let translateLeft = "translate(" + this.tableContainer.current.scrollLeft + "px,0)";
        this.tableContainer.current.querySelector("thead").style.transform = translateTop;
        for (let c of (freeze || [])) {
            for (let i = 0; i <= data.length; i++) {
                this.tableContainer.current.querySelector(`#${c}-${i}`).style.transform = translateLeft;
            }
        }
    };

    getPageControls = (page, perPage) => {
        return (<TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={3}
                      count={this.state.data.length}
                      rowsPerPage={perPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
        );
    };

    getGlossary = () => {

    };

    getTotal = (data, columns) => {
        const { ordering } = this.state;
        let totals = {};
        let value;
        for (let c of ordering) {
            value = "";
            if (columns.includes(c)) {
                value = 0;
                for (let row of data) {
                    if (!isNaN(row[c])) {
                        value += Number(row[c]);
                    }
                }
            }
            totals[c] = value;
        }
        totals[ordering[0]] = "Total";
        return totals;
    };

    changeGroupBy = (group) => () => {
        if (group === null) {
            this.setState({group_by: []});
        } else {
            this.setState({group_by: [group]});
        }
        
    };

    getGroupBtns = (group_by) => {
        let { groups } = this.state;
        if (Object.keys(groups).length > 0) {
            const groupBtn = (label, group) => <Button onClick={this.changeGroupBy(group)}>{label}</Button>;
            const btns = [groupBtn("All", null)];
            for (let group in groups) {
                btns.push(groupBtn(group, group));
            }
            return btns;
        }
    };

    getGroup = (group) => {
        let { data, groups } = this.state;
        let items = [];
        let addItem = true;
        for (let value of data) {
            addItem = true;
            for (let item of items) {
                if (item === value[group]) {
                    addItem = false;
                }
            }
            if (addItem) {
                items.push(value[group]);
            }
        }
        groups[group] = items;
        this.setState({groups});
    };

    getRow = (row, index, ordering, columns) => {
        const { classes } = this.props;
        return (
          <TableRow className={classes.tableRow} key={index}>
            {ordering.map((value, index2) => {
                let column = columns[value];
                let data = row[value];
                data = (column.hasOwnProperty("calc")) ? column.calc(data, row) : data;
                return <TableCell id={`${value}-${index + 1}`} className={classes.tableBodyCell} key={`${value}-${index}`} numeric>{(column.hasOwnProperty("render") ? column.render(data, "", row) : data)}</TableCell>
            })}
          </TableRow>
        );
    };

	render() {
		const { classes, paginate, totals, head } = this.props;
        let { columns, data, ordering, group_by, groups, perPage, page, filterValues } = this.state;
        let headProps = head || {};
        if (Object.keys(columns).length === 0) {
            return null;
        }
        const thead = (
            <TableHead className={classes.tableHead}>
                <TableRow className={classes.tableHeadRow}>
                    {ordering.map((value, index) => {
                        let thProps = headProps[value] || {};
                        return <TableCell id={`${value}-0`} className={classes.tableCell} onClick={this.handleSort(value)} key={value} {...thProps} numeric>{columns[value].label}</TableCell>;
                    })}
                </TableRow>
            </TableHead>
        );
        let footer = (paginate) ? this.getPageControls(page, perPage) : null;
        const totalRow = (totals === undefined) ? null : this.getRow(this.getTotal(data, totals), 1, ordering, columns);
        data = (paginate) ? data.slice(page * perPage, page * perPage + perPage) : data;
        if (group_by.length > 0 && Object.keys(groups).length > 0) {
            let table;
            let combinations = getCombos(group_by, groups);
            let groupedTables = combinations.map(c => {
                return (
                    <div key={Object.values(c).join("-")} className={classes.groupContainer}>
                        <Toolbar className={classes.groupHeader}>
                            <Typography className={classes.groupTitle} variant="title" color="inherit">{c[group_by[0]]}</Typography>
                        </Toolbar>
                        <Table className={classes.table}>
                            {thead}
                            <TableBody>
                                {data.map((row, index) => {
                                    for (let group of group_by) {
                                        if (row[group] !== c[group]) {
                                            return null;
                                        }
                                    }
                                    return this.getRow(row, index, ordering, columns);
                                })}
                                {totalRow}
                            </TableBody>
                        </Table>
                    </div>
                );
            });
            return (
                <Paper className={classes.root}>
                    <Toolbar className={classes.groupHeader}>
                        {this.getFilters(filterValues)}
                        <div>{this.getGroupBtns()}</div>
                    </Toolbar>
                    <div className={classes.tableContainer}>
                        {groupedTables}
                    </div>
                </Paper>
            );
        }
		return (
		    <Paper className={classes.root}>
                <Toolbar className={classes.groupHeader}>
                    {this.getFilters(filterValues)}
                    <div>{this.getGroupBtns()}</div>
                </Toolbar>
                <div className={classes.container} ref={this.tableContainer} onScroll={this.handleTableScroll}>
    				<Table className={classes.table}>
    					{thead}
                        <TableBody>
    					   {data.map((row, index) => this.getRow(row, index, ordering, columns))}
                           {totalRow}
                        </TableBody>
                        {footer}
    				</Table>
                </div>
		    </Paper>
		);
	}
}

export default withStyles(styles, { withTheme: true })(DataTable);
