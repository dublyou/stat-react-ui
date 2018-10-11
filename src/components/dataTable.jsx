import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DataTableHead from './dataTableHead';
import FilterBox from './filterBox';
import axios from 'axios';
import { getUrl } from '../utils/url';
import { toTitleCase } from '../utils/helpers';

const getCombos = (group_by, groups, combos = [], count = 0) => {
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
        for (let value of groups[label]) {
            for (let combo of combos) {
                combo[label] = value;
                newCombos.push(combo);
            }
        }
    }
    return getCombos(labels, groups, newCombos, count + 1);
}

const styles = theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        padding: '.5rem',
    },
    table: {
        width: "auto",
        transformStyle: 'preserve-3d',
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
        whiteSpace: "nowrap",
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
    },
    groupTitle: {
        fontSize: "1rem",
        color: theme.palette.grey[400]
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
    widthContainer: {
        overflow: "auto",
    },
    condenseBtn: {
        position: "absolute",
        right: 0,
    },
    progressRoot: {
        textAlign: "center",
        height: "400px"
    },
    progress: {
        margin: "5rem",
    }
});

function compare(column, dir, calc) {
    if (calc !== null) {
        return function (a, b) {
            a = calc(a[column], a);
            b = calc(b[column], b);
            if (a < b)
                return dir;
            if (a > b)
                return -dir;
            return 0;
        };
    }
    return function (a, b) {
        a = a[column];
        b = b[column];
        if (a < b)
            return dir;
        if (a > b)
            return -dir;
        return 0;
    };
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
        condense: false,
    };

    constructor(props) {
        super(props);
        this.widthContainers = [React.createRef()];
        this.fixedHeader = React.createRef();
    }

    componentWillMount() {
        let { perPage } = this.props;
        this.setState({
            perPage: perPage || 10,
        });
        this.getData();
    };

    getData = (filterValues) => {
        let { data, url, filters } = this.props;
        let state_data = this.state.data;
        if (filters !== undefined && filterValues === undefined) {
            filterValues = {};
            for (let f in filters) {
                filterValues[f] = filters[f].default || "";
            }
            this.setState({ filterValues })
        }
        filterValues = filterValues || {};
        for (let f in filterValues) {
            if (filters[f].type === "url") {
                url = url.replace("[=" + f + "=]", filterValues[f]);
            }
        }
        if (url !== undefined) {
            axios.get(getUrl(url)).then(res => {
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
                this.widthContainers.push(React.createRef());
            }
        }
        sortColumn = sortColumn || ordering[0];
        sortDir = sortDir || -1;
        this.setState({
            ordering,
        });
        this.getColumns();
        this.sortData(data, sortDir, sortColumn);
        if (groups !== undefined) {
            if (fixed_group !== undefined) {
                this.setState({ group_by: [groups[0]] })
            }
            for (let group of groups) {
                this.getGroup(group);
            }
        }
    };

    sortData = (data, sortDir, sortColumn) => {
        let { columns } = this.state;
        let calc = null;
        let data_ref = this.getDataReference(sortColumn);
        if (columns[data_ref] !== undefined) {
            if (columns[data_ref].hasOwnProperty("calc")) {
                calc = columns[data_ref].calc;
            }
        }
        this.setState({
            data: data.sort(compare(data_ref, sortDir, calc)),
            sortDir,
            sortColumn,
        });
    };

    handleSort = (value) => () => {
        let { sortColumn, sortDir, data } = this.state;
        sortDir = ((sortColumn === value) ? -sortDir : 1);
        this.sortData(data, sortDir, value);
        this.setState({ page: 0 });
    };

    getDataReference = (id) => {
        let { references } = this.state;
        if (references.hasOwnProperty(id)) {
            return references[id];
        }
        return id;
    };

    getFilters = (filterValues) => {
        const { filters, renders } = this.props;
        if (filters !== undefined) {
            return <FilterBox filters={filters} filterValues={filterValues} filterChange={this.filterChange} renders={renders} />;
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
        if (filters[id].type === "url") {
            this.getData(filterValues);
        }
    };

    filterData = (data, filterValues) => {
        const { filters } = this.props;
        const filterRow = (row, id, operand, value) => {
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
        };
        return data.filter((row) => {
            for (let key in filterValues) {
                let params = key.split("__");
                let value = filterValues[key];
                let id = params[0];
                let operand = "=";
                if (filters[id].type !== "url" && value !== null && value !== "null") {
                    if (params.length === 2) {
                        operand = params[1];
                    }
                    if (!filterRow(row, id, operand, value)) {
                        return false;
                    }
                }
            }
            return true;
        });
    };

    getColumns = () => {
        let { renders, calculations, labels } = this.props;
        let { ordering, references } = this.state;
        let columns = {};
        renders = renders || {};
        calculations = calculations || {};
        labels = labels || {};
        for (let value of ordering) {
            columns[value] = { label: labels[value] || value };
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
                func = (value, row, data) => (row[dom] > 0) ? row[num] / row[dom] : null;
                break;
            case "rank":
                let { dir } = params;
                func = (value, row, data) => {
                    value = value || row[column];
                    let column_data = data.map(r => r[column]).sort(compare_values);
                    if (dir === -1) {
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
                    let column_data = data.map(r => r[column]).sort(compare_values);
                    return value - column_data[0];
                };
                break;
            default:
                func = (value, row, data) => { return value; };
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
                    var capture = matches[i].match(/^{{\s*(data|type|row)(?:.(\w+))?\s*}}$/)
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
                        default:
                            break;
                    }
                }
            }
            return return_string;
        };
        switch (type) {
            case "html":
                func = function (data, type, row) {
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
                    switch (element) {
                        case "a":
                            if (texts[1] === "null") {
                                return null;
                            }
                            return <Button {...props} classes={{ root: classes.button, label: classes.buttonLabel }} size="small" component="a">{texts[1].replace(/ /g, "\u00a0")}</Button>;
                        default:
                            return <div>{texts[0]}<span {...props}>{texts[1]}</span>{texts[2]}</div>;
                    }
                };
                break;
            case "percent":
                func = (data, type, row) => (typeof data !== undefined && data !== null && data !== "N/A") ? Number.parseFloat(data * 100).toFixed(decimal_places) + "%" : "";
                break;
            case "currency":
                func = (data, type, row) => (typeof data !== undefined && data !== null && data !== "N/A") ? "$" + Number.parseFloat(data).toFixed(decimal_places) : "";
                break;
            case "number":
                func = (data, type, row) => (typeof data !== undefined && data !== null && data !== "N/A") ? Number.parseFloat(data).toFixed(decimal_places) : "";
                break;
            case "time":
                func = (data, type, row) => {
                    if (typeof data !== undefined && data !== null && data !== "N/A") {
                        let time_parts = data.split(":");
                        let minutes = parseInt(time_parts[0]);
                        let seconds = parseInt(time_parts[1]);
                        let milliseconds = parseInt(time_parts[2]);
                        if (minutes > 0) {
                            return [minutes, seconds].join(":");
                        }
                        return seconds + "." + milliseconds + " s"
                    }
                    return "";
                };
                break;
            default:
                func = (data, type, row) => { return data; };
        }
        return func;
    };

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ perPage: event.target.value });
    };

    handleXScroll = (index) => () => {
        const { freeze } = this.props;
        const { data } = this.state;
        let widthContainer = this.widthContainers[index].current;
        let translateX = "translateX(" + widthContainer.scrollLeft + "px)";
        for (let c of (freeze || [])) {
            for (let i = 0; i <= data.length + 1; i++) {
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
            this.setState({ group_by: [] });
        } else {
            this.setState({ group_by: [group] });
        }

    };

    toggleCondense = () => {
        this.setState({ condense: !this.state.condense });
    };

    getGroupBtns = (group_by) => {
        const { fixed_group } = this.props;
        let { groups } = this.state;
        if (Object.keys(groups).length > 0 && fixed_group === undefined) {
            const groupBtn = (label, group) => <Button key={label} onClick={this.changeGroupBy(group)}>{toTitleCase(label)}</Button>;
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
                section_rows.push(<TableRow key={value} className={classes.sectionRow}><TableCell colSpan={ordering.length}>{toTitleCase(value)}</TableCell></TableRow>);
                section_rows = section_rows.concat(data.map((row, index) => {
                    return (row[column] === value) ? this.getRow(row, index, ordering, columns) : null;
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
                this.widthContainers.push(React.createRef());
            }
        }
        groups[group] = items;
        this.setState({ groups });
    };

    getTableHeadColumns = (ordering, columns, sortColumn) => {
        const { freeze, head, theme } = this.props;
        return ordering.map((value, index) => {
            const column = columns[value];
            const other = head[value] || {};
            column.id = `${value}-${index + 1}`
            column.onClick = this.handleSort(value);
            column.styles = { "zIndex": 1 };
            if (value === sortColumn) {
                column.styles.backgroundColor = theme.palette.grey[900];
                column.styles.color = theme.palette.primary.main;
                column.styles.fontWeight = "bolder";
            }
            if (freeze !== undefined && freeze.length > index) {
                column.styles.zIndex = 2;
            }
            return {...column, ...other};
        });
    }

    getRow = (row, index, ordering, columns, totals = false) => {
        const { classes, freeze } = this.props;
        return (
            <TableRow className={classes.tableRow} key={index}>
                {ordering.map((value, index2) => {
                    let column = columns[value];
                    let data = row[value];
                    let styles = {};
                    data = (column.hasOwnProperty("calc")) ? column.calc(data, row) : data;
                    data = column.hasOwnProperty("render") ? column.render(data, "", row) : data;
                    data = (!totals || row.hasOwnProperty(value)) ? data : (index2 === 0) ? "Totals" : null;
                    if (freeze !== undefined && index2 + 1 === freeze.length) {
                        styles = {
                            boxShadow: "grey 5px 0 5px -5px inset",
                            height: "100%",
                            top: 0,
                            right: "-5px",
                            position: "absolute",
                            width: "5px",
                        }
                    }
                    return <TableCell id={`${value}-${index + 1}`} className={classes.tableBodyCell} key={`${value}-${index}`} numeric>{data}<div style={styles}></div></TableCell>
                })}
            </TableRow>
        );
    };

    render() {
        const { classes, paginate, totals, condensed } = this.props;
        let { splits } = this.props;
        let { columns, data, filterValues, group_by, groups, ordering, perPage, page, sortColumn, condense } = this.state;
        let condense_button = null;
        if (Object.keys(columns).length === 0) {
            return <div className={classes.progressRoot}><CircularProgress className={classes.progress} /></div>;
        }
        data = this.filterData(data, filterValues); /* filter the data */
        if (condensed !== undefined) {
            if (condense) {
                ordering = condensed;
                if (splits !== undefined) {
                    splits = condensed;
                }
            }
            condense_button = <FormControlLabel className={classes.condenseBtn} control={<Switch color="primary" onChange={this.toggleCondense} checked={!condense} />} label="Show All" />
        }
        let footer = (paginate) ? this.getPageControls(page, perPage) : null;
        data = (paginate) ? data.slice(page * perPage, page * perPage + perPage) : data;
        if (group_by.length > 0 && Object.keys(groups).length > 0) {
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
                if (groupData.length === 0) {
                    return null;
                }
                return (
                    <div key={Object.values(c).join("-")} className={classes.groupContainer}>
                        <Toolbar className={classes.groupHeader}>
                            <Typography className={classes.groupTitle} variant="title" color="inherit">{c[group_by[0]]}</Typography>
                        </Toolbar>
                        <div className={classes.widthContainer} ref={this.widthContainers[i]} onScroll={this.handleXScroll(i)}>
                            <Table className={classes.table}>
                                <DataTableHead columns={this.getTableHeadColumns(ordering, columns, sortColumn)}/>
                                <TableBody>
                                    {this.getSections(groupData, ordering, columns)}
                                    {totalRow}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                );
            });
            return (
                <div className={classes.root}>
                    <Toolbar className={classes.groupHeader}>
                        {this.getFilters(filterValues)}
                        {<div>{this.getGroupBtns()}</div>}
                        {condense_button}
                    </Toolbar>
                    <div className={classes.tableContainer}>
                        {groupedTables}
                    </div>
                </div>
            );
        }

        if (splits !== undefined) {
            const totalData = (totals === undefined) ? null : this.getTotal(data, totals);

            let splitTables = Object.keys(splits).map((s, i) => {
                return (
                    <div key={i} className={classes.groupContainer}>
                        <Toolbar className={classes.groupHeader}>
                            <Typography className={classes.groupTitle} variant="title">{s}</Typography>
                        </Toolbar>
                        <div className={classes.widthContainer} ref={this.widthContainers[i]} onScroll={this.handleXScroll(i)}>
                            <Table className={classes.table}>
                                <DataTableHead columns={this.getTableHeadColumns(splits[s], columns, sortColumn)}/>
                                <TableBody>
                                    {data.map((row, index) => this.getRow(row, index, splits[s], columns))}
                                    {(totalData === null) ? null : this.getRow(totalData, data.length, splits[s], columns, true)}
                                </TableBody>
                                {footer}
                            </Table>
                        </div>
                    </div>
                );
            });
            return (
                <div className={classes.root}>
                    <Toolbar className={classes.groupHeader}>
                        {this.getFilters(filterValues)}
                        <div>{this.getGroupBtns()}</div>
                        {condense_button}
                    </Toolbar>
                    {splitTables}
                </div>
            );
        }
        const totalRow = (totals === undefined) ? null : this.getRow(this.getTotal(data, totals), data.length, ordering, columns, true);
        return (
            <div className={classes.root}>
                <Toolbar className={classes.groupHeader}>
                    {this.getFilters(filterValues)}
                    <div>{this.getGroupBtns()}</div>
                    {condense_button}
                </Toolbar>
                <div className={classes.widthContainer} ref={this.widthContainers[0]} onScroll={this.handleXScroll(0)}>
                    <Table className={classes.table}>
                        <DataTableHead columns={this.getTableHeadColumns(ordering, columns, sortColumn)} sticky={true}/>
                        <TableBody>
                            {this.getSections(data, ordering, columns)}
                            {totalRow}
                        </TableBody>
                        {footer}
                    </Table>
                </div>
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(DataTable);
