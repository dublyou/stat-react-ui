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
import InputLabel from '@material-ui/core/InputLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import ObjectCard from './objectCard';
import MultiSelect from './multiSelect';
import SearchBar from './searchBar';
import SimpleList from './simpleList';
import TableCell from './tableCell'
import axios from 'axios';
import { getUrl, getImage } from '../utils/url';
import toTitleCase from '../utils/toTitleCase';
import getRanges from '../utils/helpers';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

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
  addFieldButton: {
    color: theme.palette.grey["500"],
    "&:hover": {
      color: "inherit"
    }
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
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
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
    this.state = {
      objects: {},
      fields: props.default_fields || [],
      ordering: [],
      display: "horizontal",
      dragObject: null,
      dragField: null,
      objectFilters: {},
      showFilterOptions: false,
      showFilters: true,
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

  handleFieldChange = event => {
    const { objects, objectFilters } = this.state;
    let fields = event.target.value;
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

  handleAddField = (field) => () => {
    let { objects, objectFilters, fields } = this.state;
    fields.push(field);
    for (let key in objects) {
      if (objects[key][field] === undefined) {
        this.retrieveObjectData(objects[key], objectFilters[key], fields);
      }
    }
    this.setState({ fields });
  };

  handleAddFieldClick = event => {
    this.setState({ addFieldButton: event.currentTarget });
  };

  handleAddFieldClose = () => {
    this.setState({ addFieldButton: null });
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
    let th = this.container.current.querySelector("thead>tr>th:first-child")
    if (th) {
      th.style.transform = "translate(" + this.container.current.scrollLeft + "px, " + this.container.current.scrollTop + "px)";
    }
    let ths = this.container.current.querySelectorAll("thead>tr>th");
    let i = 1;
    for (; i < ths.length; i++) {
      ths[i].style.transform = "translateY(" + this.container.current.scrollTop + "px)";
    }
    ths = this.container.current.querySelectorAll("tbody>tr>th:first-child");
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

  getObjectHeader = (ordering, objects, fields, addFieldButton) => {
    const { classes } = this.props;
    let cells = [];
    const fieldMenu = <TableCell component='th' style={{zIndex: 2}} key='add-field'>{this.getFieldMenu(fields, addFieldButton)}</TableCell>;
    if (ordering.length !== 2) {
      cells.push(fieldMenu);
    }
    for (let i = 0; i < ordering.length; i++) {
      let key = ordering[i];
      let obj = objects[key]
      if (i === 1 && ordering.length === 2) {
        cells.push(fieldMenu);
      }
      cells.push(
        <TableCell
          key={key}
          component="th"
          draggable={true}
          onDragEnter={this.handleObjectDragEnter(key)}
          onDragStart={this.handleObjectDrag(key)}
          onDragEnd={this.handleDragEnd("Object")}>
          <ObjectCard handleCloseClick={this.removeObject(key)} handleFilterClick={this.handleEditObjectFilters(obj)} {...obj}/>
        </TableCell>);
    }
    return <TableRow className={classes.tableHeadRow}>{cells}</TableRow>;
  };

  getFieldHeader = (fields, addFieldButton, filterKeys) => {
    const { classes, filterFields } = this.props;
    return (
      <TableRow className={classes.tableHeadRow}>
        <TableCell style={{zIndex: 2}} component="th">{this.getFieldMenu(fields, addFieldButton)}</TableCell>
        {filterKeys.map(filterKey => {
          const filterProps = filterFields[filterKey];
          const filterLabel = (filterProps.label !== undefined) ? filterProps.label : toTitleCase(filterKey);
          return <TableCell key={filterKey} style={{zIndex: 2}} component="th">{filterLabel}</TableCell>})}
        {fields.map((f, i) => {
          return (
            <TableCell
              key={i}
              actionType='close'
              handleActionClick={this.handleFieldDoubleClick(f)}
              component="th"
              clickable={true}
              draggable={true}
              onDragEnter={this.handleFieldDragEnter(f)}
              onDragStart={this.handleFieldDrag(f)}
              onDragEnd={this.handleDragEnd("Field")}>
              {toTitleCase(f)}
            </TableCell>);
        })}
      </TableRow>
    );
  };

  getObjectRow = (obj, fields, filters, filterKeys) => {
    const { classes, filterFields } = this.props;
    return (
      <TableRow key={obj.key} className={classes.tableRow} draggable={true} onDragEnter={this.handleObjectDragEnter(obj.key)} onDragStart={this.handleObjectDrag(obj.key)} onDragEnd={this.handleDragEnd("Object")}>
        <TableCell component="th">
          <ObjectCard handleCloseClick={this.removeObject(obj.key)} handleFilterClick={this.handleEditObjectFilters(obj)} {...obj}/>
        </TableCell>
        {filterKeys.map(filterKey => {
          const filterProps = filterFields[filterKey];
          const { selected, possible } = filters;
          return (
            <TableCell key={`${obj.key}-${filterKey}`} component='th'>
              {(selected[filterKey] === undefined) ? null : this.getFilterDisplay(filterProps, selected[filterKey], possible[filterKey])}
            </TableCell>);})}
        {fields.map((f, i) => <TableCell key={i}>{obj[f]}</TableCell>)}
      </TableRow>
    );
  };

  getFilterRow = (filter, ordering, objectFilters) => {
    const { classes, filterFields } = this.props;
    const filterProps = filterFields[filter];
    const filterLabel = (filterProps.label !== undefined) ? filterProps.label : toTitleCase(filter);
    let cells = [];
    const labelCell = (styles) => <TableCell styles={styles} key={`${filter}-filter`} component='th'>{filterLabel}</TableCell>;
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
        cells.push(<TableCell key={`${objKey}-${filter}`} styles={{ textAlign: 'center' }} component='th'>{(selected[filter] === undefined) ? null : this.getFilterDisplay(filterProps, selected[filter], possible[filter])}</TableCell>);
      } else {
        cells.push(<TableCell key={`${objKey}-${filter}`} component='th'>{(selected[filter] === undefined) ? null : this.getFilterDisplay(filterProps, selected[filter], possible[filter])}</TableCell>);
      }
    }
    return <TableRow key={filter} className={classes.tableHeadRow}>{cells}</TableRow>;
  };

  getFieldRow = (field, ordering, objects) => {
    const { classes } = this.props;
    let cells = [];
    const labelCell = (styles) => <TableCell styles={styles} key={`${field}-field`} clickable={true} component='th' actionType='close' handleActionClick={this.handleFieldDoubleClick(field)}>{toTitleCase(field)}</TableCell>;
    if (ordering.length !== 2) {
      cells.push(labelCell());
    }
    for (let i = 0; i < ordering.length; i++) {
      if (ordering.length === 2) {
        if (i === 1) {
          cells.push(labelCell({textAlign: 'center'}));
        }
        cells.push(<TableCell key={i} styles={{ textAlign: 'center' }}>{objects[ordering[i]][field]}</TableCell>);
      } else {
        cells.push(<TableCell key={i}>{objects[ordering[i]][field]}</TableCell>);
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

  getFieldMenu = (fields, addFieldButton) => {
    const { classes, comparisonFields } = this.props;
    return (
      <div className={classes.fieldMenu}>
        <Button
          aria-owns={addFieldButton ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleAddFieldClick}
          className={classes.addFieldButton}
        >
          <Icon className={classes.icon} style={{marginRight: 2}}>add_circle</Icon>Add Field
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={addFieldButton}
          open={Boolean(addFieldButton)}
          onClose={this.handleAddFieldClose}
          style={{ maxHeight: 325 }}
        >
          {comparisonFields
            .filter(value => fields.indexOf(value) === -1)
            .map(f => <MenuItem key={f} className={classes.fieldMenuItem} onClick={this.handleAddField(f)}>{toTitleCase(f)}</MenuItem>)}
        </Menu>
      </div>
    );
  }

  getDisplayOptions = (display) => {
    const { classes } = this.props;
    return (
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel>Display</FormLabel>
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
                control={<Radio color="primary" />}
                label={toTitleCase(value)}
                labelPlacement="start"
                className={classes.radioLabel}
              />);
          })}
        </RadioGroup>
      </FormControl>
    );
  };

  render() {
    const { classes, filterFields, search } = this.props;
    const { ordering, objects, objectFilters, addFieldButton, fields, 
            display, selectedObj, selectedFilters, possibleFilters, showFilters } = this.state;
    let content = <Paper className={classes.defaultContent}>{this.getFieldMenu(fields, addFieldButton)}</Paper>;
    let filterBox = null;
    let filterKeys = this.getFilterKeys(objectFilters);
    let showFiltersSwitch = filterKeys.length > 0 ? <FormControlLabel className={classes.switch} control={<Switch color="primary" onChange={this.handleShowFiltersChange} checked={showFilters}/>} label='Show Filters' labelPlacement='start'/> : null;
    filterKeys = showFilters ? filterKeys : [];

    if (display === "cards") {
      content = <div className={classes.cardContainer}>{ordering.map(id => this.getObjectCard(id, objects[id], fields))}</div>;
    } else if (display === "horizontal") {
      content = <div className={classes.container} ref={this.container} onScroll={this.handleScroll}>
          <Table className={classes.table}>
            <TableHead>{this.getFieldHeader(fields, addFieldButton, filterKeys)}</TableHead>
            <TableBody>{ordering.map(id => this.getObjectRow(objects[id], fields, objectFilters[id], filterKeys))}</TableBody>
          </Table>
        </div>;
    } else if (display === "vertical") {
      content = <div className={classes.container} ref={this.container} onScroll={this.handleScroll}>
        <Table className={classes.table}>
          <TableHead>
            {this.getObjectHeader(ordering, objects, fields, addFieldButton)}
            {filterKeys.map(f => this.getFilterRow(f, ordering, objectFilters))}
          </TableHead>
          <TableBody>{fields.map(field => this.getFieldRow(field, ordering, objects))}</TableBody>
        </Table>
      </div>;
    }

    if (selectedFilters !== undefined) {
      filterBox = (
        <Dialog
          open={this.state.showFilterOptions}
          onClose={this.handleClose}
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
              Add
            </Button>
          </DialogActions>
        </Dialog>);
    }

    return (
      <div className={classes.root}>
        <Toolbar className={classes.groupHeader}>
          {this.getDisplayOptions(display)}
          <SearchBar {...search} handleClick={this.handleClick} growOnFocus={false} width={"auto"} placeholder="Add a player..." />
          {showFiltersSwitch}
        </Toolbar>
        {content}
        {filterBox}
      </div>
    );
  }
}

export default withStyles(styles)(Comparison);
