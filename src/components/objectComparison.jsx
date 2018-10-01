import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Accordion from './accordion';
import DataTableCell from './dataTableCell'
import ObjectCard from './objectCard';
import MultiSelect from './multiSelect';
import SearchBar from './searchBar';
import SimpleList from './simpleList';
import axios from 'axios';
import forIn from 'lodash/forIn';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import { getUrl, getImage } from '../utils/url';
import toTitleCase from '../utils/toTitleCase';
import getRanges from '../utils/helpers';

const styles = theme => ({
  root: {
    padding: 5,
    borderRadius: 0,
  },
  defaultContent: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: 400,
  },
  fieldMenu: {
    textAlign: "center",
  },
  fieldMenuItem: {
    padding: ".5rem",
  },
  card: {
    display: "inline-block",
    '&last-child': {
      marginRight: 0
    }
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap"
  },
  cardHeader: {
    padding: ".5rem",
    display: "flex"
  },
  cardHeaderAvatar: {
    marginRight: ".5rem",
  },
  avatar: {
    width: "3rem",
    height: "3rem",
  },
  cardHeaderContent: {
    marginRight: ".5rem",
    textDecoration: "none",
    flex: "1 0 auto",
    "&:hover": {
      opacity: .5
    }
  },
  cardHeaderAction: {
    marginRight: "-.25rem",
    marginTop: "-.25rem",
  },
  closeIcon: {
    width: "1rem",
    height: "1rem",
  },
  deleteBtn: {
    width: "1.5rem",
    height: "1.5rem",
    backgroundColor: theme.palette.background.default,
  },
  formControl: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 1 auto',
  },
  formControlRadio: {
    margin: theme.spacing.unit,
    flexDirection: "row"
  },
  radioGroup: {
    flexDirection: "row",
  },
  radioLabel: {
    marginLeft: 0,
    marginRight: ".5rem",
  },
  options: {
    display: 'flex',
  },
  switch: {
    marginLeft: '.5rem',
  },
  table: {
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
      backgroundColor: theme.palette.common.white,
    },
    '&:hover td': {
      backgroundColor: theme.palette.grey[300],
      cursor: "pointer",
    },
  },
  container: {
    maxHeight: 500,
    overflow: "auto",
  },
});


class Comparison extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    const fields = [];
    const fieldGroups = {};
    if (!isArray(props.comparisonFields)) {
      forIn(props.comparisonFields, (fieldProps, field) => {
        if (fieldProps.default) {
          fields.push(field);
        }
        const group = get(fieldProps, 'group', 'other');
        const groupFields = get(fieldGroups, group, []);
        groupFields.push(field);
        fieldGroups[group] = groupFields;
      });
    }
    this.fieldGroups = fieldGroups;
    this.state = {
      condense: false,
      objects: {},
      fields,
      ordering: [],
      display: "horizontal",
      dragObject: null,
      dragField: null,
      objectFilters: {},
      showFilterOptions: false,
      showFilters: true,
      showFieldMenu: false,
    };
  }

  addObject = (obj, filters=null) => {
    let { objects, objectFilters, ordering } = this.state;
    let key = obj.key;
    if (key === undefined) {
      let i = 1;
      while (true) {
        key = `${obj.id}-${i}`;
        if (ordering.indexOf(key) === -1) {
          ordering.push(key);
          obj.key = key;
          objects[key] = obj;
          break;
        }
        i++;
      }
    } else {
      objects[key] = obj;
    }
    if (filters !== null) {
      objectFilters[key] = filters;
    }
    this.setState({ objects, objectFilters, ordering });
  };

  removeObject = (key) => (e) => {
    e.preventDefault();
    let { objects, objectFilters, ordering } = this.state;
    delete objects[key];
    delete objectFilters[key];
    ordering.splice(ordering.indexOf(key), 1)
    this.setState({ objects, objectFilters, ordering });
  };

  handleClick = (obj) => {
    let { filterOptionsUrl } = this.props;
    const { ordering } = this.state;
    if (filterOptionsUrl !== undefined) {
      this.retrieveObjectFilterOptions(obj);
    } else if (ordering.indexOf(obj.key) === -1) {
      this.retrieveObjectData(obj);
    }
  };

  retrieveObjectFilterOptions = (obj) => {
    const { objectFilters } = this.state;
    if (obj.key !== undefined && objectFilters[obj.key] !== undefined) {
      const { selected, possible } = objectFilters[obj.key];
      this.setState({possibleFilters: possible, selectedFilters: selected, showFilterOptions: true, selectedObj: obj })
    } else {
      let { filterOptionsUrl } = this.props;
      let url = getUrl(filterOptionsUrl, { id: obj.id });
      axios.get(url).then(res => {
        return res.data;
      }).catch(error => {
        return null;
      }).then(filters => {
        this.setState({ possibleFilters: filters, selectedFilters: {...filters}, showFilterOptions: true, selectedObj: obj });
      });
    }
  };

  retrieveObjectData = (obj, filters=null, fields=null) => {
    let { url, retrieveMethod='post' } = this.props;
    const { objectFilters } = this.state;
    filters = (objectFilters[obj.key] === undefined || filters !== null) ? filters : objectFilters[obj.key];
    fields = fields || this.state.fields;
    if (fields.length === 0) {
      this.addObject(obj, filters);
    } else {
      if (retrieveMethod === 'post') {
        axios.post(getUrl(url, { id: obj.id}), {
          fields: fields,
          filters: filters !== null ? filters.selected : {},
        }).then(res => {
          return res.data;
        }).catch(error => {
          return null;
        }).then(data => {
          if (data !== null) {
            this.addObject({...obj, ...data }, filters);
          }
        });
      } else {
        url = getUrl(url, { id: obj.id, fields: fields.join("-") });
        if (filters !== null) {
          const { selected } = filters;
          for (let filterKey in selected) {
            url += `${filterKey}=${selected[filterKey].join("-")}/`;
          }
        }
        axios.get(url).then(res => {
          return res.data;
        }).catch(error => {
          return null;
        }).then(data => {
          if (data !== null) {
            this.addObject({...obj, ...data }, filters);
          }
        });
      }
    }
  };

  handleCondenseChange = () => {
    this.setState({condense: !this.state.condense});
  }

  handleDisplayChange = (event) => {
    this.setState({
      display: event.target.value,
    });
  };

  handleObjectDrag = (key) => () => {
    const { ordering } = this.state;
    this.setState({ dragObject: { key, start: ordering.indexOf(key) } });
  };

  handleFieldDrag = (field) => () => {
    const { fields } = this.state;
    this.setState({ dragField: { value: field, start: fields.indexOf(field) } });
  };

  handleDragEnd = (type) => () => {
    this.setState({ [`drag${type}`]: null });
  };

  handleFieldChange = fields => {
    const { objects, objectFilters } = this.state;
    for (let key in objects) {
      for (let field in fields) {
        if (objects[key][field] === undefined) {
          this.retrieveObjectData(objects[key], objectFilters[key], fields);
          break;
        }
      }
    }
    this.setState({ fields });
  };

  handleAddFieldClick = () => {
    this.setState({ showFieldMenu: true });
  };

  handleAddFieldClose = () => {
    this.setState({ showFieldMenu: false });
  };

  handleFieldDoubleClick = (field) => () => {
    let { fields } = this.state;
    fields.splice(fields.indexOf(field), 1);
    this.setState({ fields });
  }

  handleObjectDragEnter = (key) => () => {
    let { ordering, dragObject } = this.state;
    if (dragObject !== null && key !== dragObject.key) {
      let current = ordering.indexOf(dragObject.key);
      let target = ordering.indexOf(key);
      ordering[current] = key;
      ordering[target] = dragObject.key;
      this.setState({ ordering });
    }
  };

  handleFieldDragEnter = (field) => () => {
    let { fields, dragField } = this.state;
    if (dragField !== null && field !== dragField.value) {
      let current = fields.indexOf(dragField.value);
      let target = fields.indexOf(field);
      fields[current] = field;
      fields[target] = dragField.value;
      this.setState({ fields });
    }
  };

  handleEditObjectFilters = (obj) => () => {
    this.retrieveObjectFilterOptions(obj);
  }

  handleFilterChange = (filter) => (event, new_value=null) => {
    let { selectedFilters } = this.state;
    new_value = new_value || event.target.value;
    selectedFilters[filter] = Array.isArray(new_value) ? new_value : [new_value];
    this.setState({ selectedFilters });
  };

  handleFilterAdd = (obj, filters) => () => {
    this.retrieveObjectData(obj, filters);
    this.handleFilterClose();
  };

  handleFilterClose = () => {
    this.setState({ showFilterOptions: false });
  };

  handleShowFiltersChange = () => {
    this.setState({showFilters: !this.state.showFilters});
  }

  handleScroll = () => {
    let th = this.container.current.querySelector("thead>tr:first-child>th:first-child")
    if (th) {
      th.style.transform = "translate(" + this.container.current.scrollLeft + "px, " + this.container.current.scrollTop + "px)";
    }

    let ths = this.container.current.querySelectorAll("thead>tr>th");
    let i = 1;
    for (; i < ths.length; i++) {
      ths[i].style.transform = "translateY(" + this.container.current.scrollTop + "px)";
    }
    ths = this.container.current.querySelectorAll('thead>tr>th.freeze-column');
    for (i = 0; i < ths.length; i++) {
      ths[i].style.transform = "translateX(" + this.container.current.scrollLeft + "px)";
    }
    ths = this.container.current.querySelectorAll("tbody>tr>th");
    for (i = 0; i < ths.length; i++) {
      ths[i].style.transform = "translateX(" + this.container.current.scrollLeft + "px)";
    }
  };

  getFilterKeys = (objectFilters) => {
    let filterKeys = [];
    for (let objKey in objectFilters) {
      let objFilters = objectFilters[objKey].selected;
      if (objFilters !== undefined) {
        for (let filterKey in objFilters) {
          if (filterKeys.indexOf(filterKey) === -1) {
            filterKeys.push(filterKey);
          }
        }
      }
    }
    return filterKeys;
  };

  getFilterDisplay = (props, values, possibleValues=null) => {
    const { continuous=false } = props;
    if (values.length === possibleValues.length && values.length > 0) {
      return 'All' + (continuous ? ` (${getRanges(values, possibleValues)})` : '');
    } else if (values.length > 1) {
      let display = continuous ? getRanges(values, possibleValues) : values;
      return display.map(value => toTitleCase(value)).join(', ');
    } else {
      return values;
    }
  };

  getObjectHeader = (ordering, objects, condense) => {
    const { classes } = this.props;
    let cells = [];
    if (ordering.length !== 2) {
      cells.push(<DataTableCell key='blank' component='th' style={{zIndex: 2}} />);
    }
    for (let i = 0; i < ordering.length; i++) {
      let key = ordering[i];
      let obj = objects[key]
      if (i === 1 && ordering.length === 2) {
        cells.push(<DataTableCell key='blank' component='th' style={{zIndex: 2}} />);
      }
      cells.push(
        <DataTableCell
          key={key}
          component="th"
          draggable={true}
          onDragEnter={this.handleObjectDragEnter(key)}
          onDragStart={this.handleObjectDrag(key)}
          onDragEnd={this.handleDragEnd("Object")}>
          <ObjectCard handleCloseClick={this.removeObject(key)} handleFilterClick={this.handleEditObjectFilters(obj)} condense={condense} {...obj}/>
        </DataTableCell>);
    }
    return <TableRow className={classes.tableHeadRow}>{cells}</TableRow>;
  };

  getFieldHeader = (fields, filterKeys) => {
    const { classes, filterFields } = this.props;
    return (
      <TableRow className={classes.tableHeadRow}>
        <DataTableCell component='th' style={{zIndex: 2}}/>
        {filterKeys.map(filterKey => {
          const filterProps = filterFields[filterKey];
          const filterLabel = (filterProps.label !== undefined) ? filterProps.label : toTitleCase(filterKey);
          return <DataTableCell key={filterKey} className='freeze-column' style={{zIndex: 2}} component='th'>{filterLabel}</DataTableCell>})}
        {fields.map((f, i) => {
          return (
            <DataTableCell
              key={i}
              actionType='close'
              handleActionClick={this.handleFieldDoubleClick(f)}
              component='th'
              clickable={true}
              draggable={true}
              onDragEnter={this.handleFieldDragEnter(f)}
              onDragStart={this.handleFieldDrag(f)}
              onDragEnd={this.handleDragEnd('Field')}>
              {toTitleCase(f)}
            </DataTableCell>);
        })}
      </TableRow>
    );
  };

  getObjectRow = (obj, fields, filters, filterKeys, condense) => {
    const { classes, filterFields } = this.props;
    return (
      <TableRow key={obj.key} className={classes.tableRow} draggable={true} onDragEnter={this.handleObjectDragEnter(obj.key)} onDragStart={this.handleObjectDrag(obj.key)} onDragEnd={this.handleDragEnd("Object")}>
        <DataTableCell component="th">
          <ObjectCard handleCloseClick={this.removeObject(obj.key)} handleFilterClick={this.handleEditObjectFilters(obj)} condense={condense} {...obj}/>
        </DataTableCell>
        {filterKeys.map(filterKey => {
          const filterProps = filterFields[filterKey];
          const { selected, possible } = filters;
          return (
            <DataTableCell key={`${obj.key}-${filterKey}`} component='th'>
              {(selected[filterKey] === undefined) ? null : this.getFilterDisplay(filterProps, selected[filterKey], possible[filterKey])}
            </DataTableCell>);})}
        {fields.map((f, i) => <DataTableCell key={i}>{obj[f]}</DataTableCell>)}
      </TableRow>
    );
  };

  getFilterRow = (filter, ordering, objectFilters) => {
    const { classes, filterFields } = this.props;
    const filterProps = filterFields[filter];
    const filterLabel = (filterProps.label !== undefined) ? filterProps.label : toTitleCase(filter);
    let cells = [];
    const labelCell = (styles) => <DataTableCell styles={styles} key={`${filter}-filter`} component='th'>{filterLabel}</DataTableCell>;
    if (ordering.length !== 2) {
      cells.push(labelCell({zIndex: 2}));
    }
    for (let i = 0; i < ordering.length; i++) {
      const objKey = ordering[i];
      const { selected, possible } = objectFilters[objKey];
      if (ordering.length === 2) {
        if (i === 1) {
          cells.push(labelCell({zIndex: 2, textAlign: 'center'}));
        }
        cells.push(<DataTableCell key={`${objKey}-${filter}`} styles={{ textAlign: 'center' }} component='th'>{(selected[filter] === undefined) ? null : this.getFilterDisplay(filterProps, selected[filter], possible[filter])}</DataTableCell>);
      } else {
        cells.push(<DataTableCell key={`${objKey}-${filter}`} component='th'>{(selected[filter] === undefined) ? null : this.getFilterDisplay(filterProps, selected[filter], possible[filter])}</DataTableCell>);
      }
    }
    return <TableRow key={filter} className={classes.tableHeadRow}>{cells}</TableRow>;
  };

  getFieldRow = (field, ordering, objects) => {
    const { classes } = this.props;
    let cells = [];
    const labelCell = (styles) => <DataTableCell styles={styles} key={`${field}-field`} clickable={true} component='th' actionType='close' handleActionClick={this.handleFieldDoubleClick(field)}>{toTitleCase(field)}</DataTableCell>;
    if (ordering.length !== 2) {
      cells.push(labelCell());
    }
    for (let i = 0; i < ordering.length; i++) {
      if (ordering.length === 2) {
        if (i === 1) {
          cells.push(labelCell({textAlign: 'center'}));
        }
        cells.push(<DataTableCell key={i} styles={{ textAlign: 'center' }}>{objects[ordering[i]][field]}</DataTableCell>);
      } else {
        cells.push(<DataTableCell key={i}>{objects[ordering[i]][field]}</DataTableCell>);
      }
    }
    return <TableRow key={field} className={classes.tableRow} draggable={true} onDragEnter={this.handleFieldDragEnter(field)} onDragStart={this.handleFieldDrag(field)} onDragEnd={this.handleDragEnd("Field")}>{cells}</TableRow>;
  };

  getObjectCardHeader = (obj) => {
    const { classes, subheader } = this.props;
    const action = <IconButton className={classes.deleteBtn} onClick={this.removeObject(obj.key)}><CloseIcon className={classes.closeIcon} /></IconButton>;
    return (
      <Card onDoubleClick={this.removeObject(obj.key)}>
        <CardHeader
          className={classes.cardHeader}
          action={action}
          avatar={<Avatar className={classes.avatar} alt={obj.name} src={getImage(obj.image)} />}
          classes={{ avatar: classes.cardHeaderAvatar, action: classes.cardHeaderAction, title: classes.cardHeaderContent }}
          title={obj.name || null}
          titleTypographyProps={{ component: "a", href: obj.url, target: "_blank" }}
          subheader={obj[subheader] || null}
        />
      </Card>);
  }

  getObjectChip = (obj) => {
    const { classes } = this.props;
    return (
      <Chip
        avatar={<Avatar alt={obj.name} src={getImage(obj.image)} />}
        label={obj.name}
        onDelete={this.removeObject(obj.key)}
        className={classes.chip}
        component="a"
        href={obj.url}
        clickable
      />);
  };

  getObjectCard = (id, obj, fields) => {
    const { classes, subheader } = this.props;
    const items = fields.map(f => {
      return { primary: obj[f] || "N/A", secondary: f };
    });
    //const action = <IconButton onClick={this.removeObject(id)}><CloseIcon /></IconButton>;
    return (
      <Card className={classes.card}
        onDoubleClick={this.removeObject(obj.key)}
        draggable={true}
        onDragEnter={this.handleObjectDragEnter(id)}
        onDragStart={this.handleObjectDrag(id)}
        onDragEnd={this.handleDragEnd("Object")}>
        <CardHeader
          avatar={<Avatar alt={obj.name} src={getImage(obj.image)} />}
          title={obj.name || null}
          subheader={obj[subheader] || null}
        />
        <CardContent>
          <SimpleList items={items} list_styles={classes.detailList} styles={classes.detailItem} secondary_styles={classes.detailItemLabel} />
        </CardContent>
      </Card>
    )
  };

  getDisplayOptions = (display) => {
    const { classes } = this.props;
    return (
      <FormControl className={classes.formControl}>
        <FormLabel>Display:</FormLabel>
        <RadioGroup
          aria-label="display"
          name="display"
          className={classes.radioGroup}
          value={display}
          onChange={this.handleDisplayChange}
        >
          {["horizontal", "vertical"].map(value => {
            return (
              <FormControlLabel
                key={value} value={value}
                control={<Radio color="primary" style={{height: '3rem', width: '3rem'}}/>}
                label={toTitleCase(value)}
                className={classes.radioLabel}
              />);
          })}
        </RadioGroup>
      </FormControl>
    );
  };

  getFieldMenuGroups = (fields) => {
    const fieldMenuGroups = [];
    forIn(this.fieldGroups, (groupFields, group) => {
      let selected = groupFields.reduce((total, field) => {
        return total + (fields.indexOf(field) === -1 ? 0 : 1);
      }, 0);
      fieldMenuGroups.push({title: `${toTitleCase(group)} (${selected} of ${groupFields.length})`, selected: fields, type: 'select-menu', handleChange: this.handleFieldChange, options: groupFields});
    });
    return fieldMenuGroups;
  };

  render() {
    const { classes, filterFields, search } = this.props;
    const { ordering, objects, objectFilters, fields, display, selectedObj, 
            selectedFilters, possibleFilters, showFilters, condense } = this.state;
    
    let content = <Paper className={classes.defaultContent}></Paper>;
    let filterBox = null;
    let filterKeys = this.getFilterKeys(objectFilters);
    let showFiltersSwitch = filterKeys.length > 0 ? <FormControlLabel className={classes.switch} control={<Switch color="primary" onChange={this.handleShowFiltersChange} checked={showFilters}/>} label='Show Filters'/> : null;
    filterKeys = showFilters ? filterKeys : [];

    if (fields.length > 0  || ordering.length > 0) {
      if (display === "horizontal") {
        content = <div className={classes.container} ref={this.container} onScroll={this.handleScroll}>
            <Table className={classes.table}>
              <TableHead>{this.getFieldHeader(fields, filterKeys)}</TableHead>
              <TableBody>{ordering.map(key => this.getObjectRow(objects[key], fields, objectFilters[key], filterKeys, condense))}</TableBody>
            </Table>
          </div>;
      } else if (display === "vertical") {
        content = <div className={classes.container} ref={this.container} onScroll={this.handleScroll}>
          <Table className={classes.table}>
            <TableHead>
              {this.getObjectHeader(ordering, objects, condense)}
              {filterKeys.map(f => this.getFilterRow(f, ordering, objectFilters))}
            </TableHead>
            <TableBody>{fields.map(field => this.getFieldRow(field, ordering, objects))}</TableBody>
          </Table>
        </div>;
      }
    }

    if (selectedFilters !== undefined) {
      filterBox = (
        <Dialog
          open={this.state.showFilterOptions}
          onClose={this.handleFilterClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Data Filters</DialogTitle>
          <DialogContent>
            {Object.keys(filterFields).map(f => <MultiSelect key={`filter-${f}`} label={f} selectedFields={selectedFilters[f]} possibleFields={possibleFilters[f]} handleChange={this.handleFilterChange(f)} continuous={filterFields[f].continuous}/>)}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleFilterClose} color="primary">
              Cancel
              </Button>
            <Button onClick={this.handleFilterAdd(selectedObj, {possible: possibleFilters, selected: selectedFilters})} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>);
    }

    return (
      <div className={classes.root}>
        <Toolbar className={classes.groupHeader}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={12} md={4}>
              <SearchBar {...search} handleClick={this.handleClick} growOnFocus={false} width={"auto"} placeholder="Add a player..." />
            </Grid>
            <Grid item xs={12} sm={12} md={8} className={classes.options}>
              <div>
                <Button
                  onClick={this.handleAddFieldClick}
                  color='primary'
                >
                  <Icon className={classes.icon} style={{marginRight: 2}}>add_circle</Icon>Add&nbsp;Field
                </Button>
              </div>
              {this.getDisplayOptions(display)}
              <div>
                {showFiltersSwitch}
                <FormControlLabel className={classes.switch} control={<Switch color="primary" onChange={this.handleCondenseChange} checked={condense}/>} label='Condense'/>
              </div>
            </Grid>
          </Grid>
        </Toolbar>
        {content}
        {filterBox}
        <Dialog
          open={this.state.showFieldMenu}
          onClose={this.handleAddFieldClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Fields</DialogTitle>
          <DialogContent>
            <Accordion expands={this.getFieldMenuGroups(fields)}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleAddFieldClose} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(Comparison);
