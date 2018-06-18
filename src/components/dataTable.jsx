import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
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
    },
    table: {
        minWidth: 700,
        width: "auto",
        margin: "auto"
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
        '&:nth-of-type(even) td': {
            backgroundColor: theme.palette.grey[100],
        },
        '&:nth-of-type(odd) td': {
          backgroundColor: theme.palette.grey[300],
        },
        '&:hover td': {
            backgroundColor: theme.palette.grey[400],
            cursor: "pointer",
        }
    },
    tableCell: {
        padding: 10,
        textAlign: "left",
        backgroundColor: theme.palette.background.default,
        position: "relative",
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
    },
    sectionRow: {
        height: 30,
        backgroundColor: theme.palette.grey[500],
        '&:hover': {
            backgroundColor: theme.palette.grey[600],
            cursor: "pointer",
        }
    },
    groupContainer: {
        margin: ".2rem",
        width: "100%"
    },
    groupHeader: {
        minHeight: 20,
        padding: 5,
        margin: "auto",
        width: "95%"
    },
    groupTitle: {
        fontSize: 16,
        color: "#ddd",
    },
    tableContainer: {
        display: "flex",
        flexWrap: "wrap",
        width: "100%"
    },
    button: {
        color: "#0066ff",
        fontSize: 11,
        padding: 2,
        textAlign: "left",
        justifyContent: "initial",
        minHeight: 16,
        position: "static",
        "&:hover": {
            color: theme.palette.primary.main,
        }
    },
    buttonLabel: {
        textTransform: 'capitalize',
    },
    container: {
        maxHeight: 400,
        overflow: "auto",
        display: "inline-block",
    },
    widthContainer: {
        width: "95%",
        margin: "auto",
        overflow: "auto",
    }
});

function compare(column, dir, calc) {
    if (calc !== undefined) {
        return function(a, b) {
            a = calc(a[column], a);
            b = calc(b[column], b);
            if (a < b)
                return dir;
            if (a > b)
                return -dir;
            return 0;
        };
    }
    return function(a, b) {
        a = a[column];
        b = b[column];
        if (a < b)
            return dir;
        if (a > b)
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
        this.heightContainers = [React.createRef()];
        this.widthContainers = [React.createRef()];
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
        let { groups, ordering, sortColumn, sortDir, splits, fixed_group } = this.props;
        ordering = ordering || Object.keys(data[0]);
        if (splits !== undefined) {
            ordering = [];
            this.heightContainers = [];
            this.widthContainers = [];
            for (let s in splits) {
                ordering = ordering.concat(splits[s]);
                this.heightContainers.push(React.createRef());
                this.widthContainers.push(React.createRef());
            }
        }
        sortColumn = sortColumn || ordering[0];
        sortDir = sortDir || 1;
        this.setState({
            ordering,
        });
        this.getColumns();
        this.sortData(data, sortDir, sortColumn);
        if (groups !== undefined) {
            if (fixed_group !== undefined) {
                this.setState({group_by: [groups[0]]})
            }
            for (let group of groups) {
                this.getGroup(group);
            }
        }
    };

    sortData = (data, sortDir, sortColumn) => {
        let { columns } = this.state;
        this.setState({
            data: data.sort(compare(sortColumn, sortDir, columns[sortColumn].calc)),
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
        let { calc, column } = params;
        let func;
        function compare_values(a, b) {
            if (a < b)
                return 1;
            if (a > b)
                return -1;
            return 0;
        };
        switch (calc) {
            case "ratio":
                let { num, dom } = params;
                func = (value, row, data) => (row[dom] > 0) ? row[num]/row[dom] : null;
                break;
            case "rank":
                let { dir } = params;
                func = (value, row, data) => {
                    value = value || row[column];
                    column_data = data.map(r => r[column]).sort(compare_values);
                    if (dir == -1) {
                        column_data = column_data.reverse()
                    }
                    for (let rank = 1; rank <= column_data.length; rank++) {
                        if (value === column_data[rank - 1]) {
                            return rank;
                        }
                    }
                    return column_data.length;
                };
                break;
            case "forcediff":
                func = (value, row, data) => {
                    column_data = data.map(r => r[column]).sort(compare_values);
                    return value - column_data[0];
                };
                break;
            default:
                func = (value, row, data) => {return value;};
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

    handleYScroll = (index) => () => {
        
        const { freeze } = this.props;
        const { data } = this.state;
        let heightContainer = this.heightContainers[index].current;
        let widthContainer = this.widthContainers[index].current;
        let translate = "translate(" + widthContainer.scrollLeft + "px, " + heightContainer.scrollTop + "px)";
        let translateY = "translateY(" + heightContainer.scrollTop + "px)";
        let ths = heightContainer.querySelectorAll("th");
        for (let i = 0; i < ths.length; i++) {
            if (freeze !== undefined && i < freeze.length) {
                ths[i].style.transform = translate;
            } else {
                ths[i].style.transform = translateY;
            }
        }
    };

    handleXScroll = (index) => () => {
        const { freeze } = this.props;
        const { data } = this.state;
        let heightContainer = this.heightContainers[index].current;
        let widthContainer = this.widthContainers[index].current;
        let translate = "translate(" + widthContainer.scrollLeft + "px, " + heightContainer.scrollTop + "px)";
        let translateX = "translateX(" + widthContainer.scrollLeft + "px)";
        for (let c of (freeze || [])) {
            let el = widthContainer.querySelector(`#${c}-0`);
            if (el !== null) {
                el.style.transform = translate;
            }
            for (let i = 1; i <= data.length + 1; i++) {
                let el = widthContainer.querySelector(`#${c}-${i}`);
                if (el !== null) {
                    el.style.transform = translateX;
                }
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
        let totals = {};
        let value;
        for (let c of columns) {
            value = 0;
            for (let row of data) {
                if (!isNaN(row[c])) {
                    value += Number(row[c]);
                }
            }
            totals[c] = value;
        }
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
        const { fixed_group } = this.props;
        let { groups } = this.state;
        if (Object.keys(groups).length > 0 && fixed_group === undefined) {
            const groupBtn = (label, group) => <Button onClick={this.changeGroupBy(group)}>{toTitleCase(label)}</Button>;
            const btns = [groupBtn("All", null)];
            for (let group in groups) {
                btns.push(groupBtn(group, group));
            }
            return btns;
        }
    };

    getSections = (data, ordering, columns) => {
        const { classes, sections } = this.props;
        if (sections !== undefined) {
            let { column, values, collapse } = sections;
            let section_rows = [];
            for (let value of values) {
                section_rows.push(<TableRow className={classes.sectionRow}><TableCell colSpan={ordering.length}>{toTitleCase(value)}</TableCell></TableRow>);
                section_rows = section_rows.concat(data.map((row, index) => {
                    console.log(value);
                    console.log(column);
                    return (row["starter"] === value) ? this.getRow(row, index, ordering,  columns) : null;
                }));
            }
            return section_rows;
        }
        return data.map((row, index) => this.getRow(row, index, ordering, columns));
    };

    getGroup = (group) => {
        let { data, groups } = this.state;
        let items = [];
        let addItem = true;
        for (let row of data) {
            addItem = true;
            for (let item of items) {
                if (item === row[group]) {
                    addItem = false;
                }
            }
            if (addItem) {
                items.push(row[group]);
                this.heightContainers.push(React.createRef());
                this.widthContainers.push(React.createRef());
            }
        }
        groups[group] = items;
        this.setState({groups});
    };

    getRow = (row, index, ordering, columns, totals=false) => {
        const { classes } = this.props;
        return (
          <TableRow className={classes.tableRow} key={index}>
            {ordering.map((value, index2) => {
                let column = columns[value];
                let data = row[value];
                data = (column.hasOwnProperty("calc")) ? column.calc(data, row) : data;
                data = column.hasOwnProperty("render") ? column.render(data, "", row) : data;
                data = (!totals || row.hasOwnProperty(value)) ? data : (index2 === 0) ? "Totals" : null;

                return <TableCell id={`${value}-${index + 1}`} className={classes.tableBodyCell} key={`${value}-${index}`} numeric>{data}</TableCell>
            })}
          </TableRow>
        );
    };

	render() {
		const { classes, theme, paginate, totals, head, splits, freeze, fixed_group, sections } = this.props;
        let { columns, data, filterValues, group_by, groups, ordering, perPage, page, sortColumn } = this.state;
        let headProps = head || {};
        if (Object.keys(columns).length === 0) {
            return null;
        }
        let thead = (
            <TableHead className={classes.tableHead}>
                <TableRow className={classes.tableHeadRow}>
                    {ordering.map((value, index) => {
                        let thProps = headProps[value] || {};
                        let styles = {"zIndex": 1};
                        if (value === sortColumn) {
                            styles["backgroundColor"] = theme.palette.grey[900];
                            styles["color"] = theme.palette.primary.main;
                            styles["fontWeight"] = "bolder";
                        }
                        if (freeze !== undefined && freeze.length > index) {
                            styles["zIndex"] = 2;
                        }
                        return <TableCell id={`${value}-0`} style={styles} className={classes.tableCell} onClick={this.handleSort(value)} key={value} {...thProps} numeric>{columns[value].label}</TableCell>;
                    })}
                </TableRow>
            </TableHead>
        );
        let footer = (paginate) ? this.getPageControls(page, perPage) : null;
        data = (paginate) ? data.slice(page * perPage, page * perPage + perPage) : data;
        if (group_by.length > 0 && Object.keys(groups).length > 0) {
            let table;
            let combinations = getCombos(group_by, groups);
            let groupedTables = combinations.map((c, i) => {
                let groupData = data.filter(row => {
                    for (let group of group_by) {
                        if (row[group] !== c[group]) {
                            return false;
                        }
                    }
                    return true;
                });
                let totalRow = (totals === undefined) ? null : this.getRow(this.getTotal(groupData, totals), data.length, ordering, columns, true);
                return (
                    <div key={Object.values(c).join("-")} className={classes.groupContainer}>
                        <Toolbar className={classes.groupHeader}>
                            <Typography className={classes.groupTitle} variant="title" color="inherit">{c[group_by[0]]}</Typography>
                        </Toolbar>
                        <div className={classes.widthContainer} ref={this.widthContainers[i]} onScroll={this.handleXScroll(i)}>
                            <div className={classes.container} ref={this.heightContainers[i]} onScroll={this.handleYScroll(i)}>
                                <Table className={classes.table}>
                                    {thead}
                                    <TableBody>
                                        {this.getSections(groupData, ordering, columns)}
                                        {totalRow}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                );
            });
            return (
                <Paper className={classes.root}>
                    <Toolbar className={classes.groupHeader}>
                        {this.getFilters(filterValues)}
                        {<div>{this.getGroupBtns()}</div>}
                    </Toolbar>
                    <div className={classes.tableContainer}>
                        {groupedTables}
                    </div>
                </Paper>
            );
        }

        if (splits !== undefined) {
            const totalData = (totals === undefined) ? null : this.getTotal(data, totals);
            let splitTables = Object.keys(splits).map((s, i) => {
                let thead = (
                    <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableHeadRow}>
                            {splits[s].map((value, index) => {
                                let thProps = headProps[value] || {};
                                let styles = {"zIndex": 1};
                                if (value === sortColumn) {
                                    styles["backgroundColor"] = theme.palette.grey[900];
                                    styles["color"] = theme.palette.primary.main;
                                    styles["fontWeight"] = "bolder";
                                }
                                if (freeze !== undefined && freeze.length > index) {
                                    styles["zIndex"] = 2;
                                }
                                return <TableCell id={`${value}-0`} style={styles} className={classes.tableCell} onClick={this.handleSort(value)} key={value} {...thProps} numeric>{columns[value].label}</TableCell>;
                            })}
                        </TableRow>
                    </TableHead>
                );
                return (
                    <div key={i} className={classes.groupContainer}>
                        <Toolbar className={classes.groupHeader}>
                            <Typography className={classes.groupTitle} variant="title" color="inherit">{s}</Typography>
                        </Toolbar>
                        <div className={classes.widthContainer} ref={this.widthContainers[i]} onScroll={this.handleXScroll(i)}>
                            <div className={classes.container} ref={this.heightContainers[i]} onScroll={this.handleYScroll(i)}>
                                <Table className={classes.table}>
                                    {thead}
                                    <TableBody>
                                       {data.map((row, index) => this.getRow(row, index, splits[s], columns))}
                                       {(totalData === null) ? null : this.getRow(totalData, data.length, splits[s], columns, true)}
                                    </TableBody>
                                    {footer}
                                </Table>
                            </div>
                        </div>
                    </div>
                );
            });
            return (
                <Paper className={classes.root}>
                    <Toolbar className={classes.groupHeader}>
                        {this.getFilters(filterValues)}
                        <div>{this.getGroupBtns()}</div>
                    </Toolbar>
                    {splitTables}
                </Paper>
            );
        }
        const totalRow = (totals === undefined) ? null : this.getRow(this.getTotal(data, totals), data.length, ordering, columns, true);
		return (
		    <Paper className={classes.root}>
                <Toolbar className={classes.groupHeader}>
                    {this.getFilters(filterValues)}
                    <div>{this.getGroupBtns()}</div>
                </Toolbar>
                <div className={classes.widthContainer} ref={this.widthContainers[0]} onScroll={this.handleXScroll(0)}>
                    <div className={classes.container} ref={this.heightContainers[0]} onScroll={this.handleYScroll(0)}>
        				<Table className={classes.table}>
        					{thead}
                            <TableBody>
        					   {this.getSections(data, ordering, columns)}
                               {totalRow}
                            </TableBody>
                            {footer}
        				</Table>
                    </div>
                </div>
		    </Paper>
		);
	}
}

export default withStyles(styles, { withTheme: true })(DataTable);
