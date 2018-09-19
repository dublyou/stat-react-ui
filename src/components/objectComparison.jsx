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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import ObjectCard from './objectCard';
import MultiSelect from './multiSelect';
import SearchBar from './searchBar';
import SimpleList from './simpleList';
import axios from 'axios';
import { getUrl, getImage } from '../utils/url';
import toTitleCase from '../utils/toTitleCase';


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
  tableCell: {
    padding: ".5rem",
    textAlign: "left",
    fontSize: "1rem",
    backgroundColor: theme.palette.background.default,
    position: "relative",
    borderBottom: "none",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.primary.main,
    },
    "&:last-child": {
      paddingRight: ".5rem"
    }
  },
  tableBodyCell: {
    color: theme.palette.grey[800],
    fontSize: "1.25rem",
    textAlign: "center",
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
    borderBottom: "none",
    whiteSpace: "nowrap",
    "&:last-child": {
      paddingRight: ".5rem"
    }
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
      selectFilters: {},
      filterOpen: false,
    };
  }

  addObject = (obj) => {
    let { objects, ordering } = this.state;
    objects[obj.id] = obj;
    if (ordering.indexOf(obj.id) === -1) {
      ordering.push(obj.id);
    }
    this.setState({ objects, ordering });
  };

  removeObject = (id) => (e) => {
    e.preventDefault();
    let { objects, ordering } = this.state;
    delete objects[id];
    ordering.splice(ordering.indexOf(id), 1)
    this.setState({ objects, ordering });
  };

  handleClick = (obj) => {
    let { filterOptionsUrl } = this.props;
    const { ordering } = this.state;
    if (filterOptionsUrl !== undefined) {
      this.retrieveObjectFilterOptions(obj);
    } else if (ordering.indexOf(obj.id) === -1) {
      this.retrieveObjectData(obj);
    }
  };

  retrieveObjectFilterOptions = (obj) => {
    let { filterOptionsUrl } = this.props;
    let url = getUrl(filterOptionsUrl, { id: obj.id });
    axios.get(url).then(res => {
      return res.data;
    }).catch(error => {
      return null;
    }).then(filters => this.setState({ filters, selectedFilters: filters, filterOpen: true, selectedObj: obj }));
  };

  retrieveObjectData = (obj, filters = null, fields = null) => {
    let { url = '/players/data/[=fields=]/[=id=]/' } = this.props;
    fields = fields || this.state.fields;
    if (fields.length === 0) {
      this.addObject(obj);
    } else {
      url = getUrl(url, { id: obj.id, fields: fields.join("-") });
      if (filters !== null) {
        for (let filter in filters) {
          url += `${filter}=${filters.join("-")}/`;
        }
      }
      axios.get(url).then(res => {
        return res.data;
      }).catch(error => {
        return null;
      }).then(data => {
        if (data !== null) {
          data = Object.assign(data, obj);
          this.addObject(data);
        }
      });
    }
  };

  handleDisplayChange = (event) => {
    this.setState({
      display: event.target.value,
    });
  };

  handleObjectDrag = (id) => () => {
    const { ordering } = this.state;
    this.setState({ dragObject: { value: id, start: ordering.indexOf(id) } });
  };

  handleFieldDrag = (field) => () => {
    const { fields } = this.state;
    this.setState({ dragField: { value: field, start: fields.indexOf(field) } });
  };

  handleDragEnd = (type) => () => {
    this.setState({ [`drag${type}`]: null });
  };

  handleFieldChange = event => {
    const { objects } = this.state;
    let fields = event.target.value;
    for (let id in objects) {
      for (let field in fields) {
        if (objects[id][field] === undefined) {
          this.retrieveObjectData(objects[id], null, fields);
          break;
        }
      }
    }
    this.setState({ fields });
  };

  handleAddField = (field) => () => {
    let { objects, fields } = this.state;
    fields.push(field);
    for (let id in objects) {
      if (objects[id][field] === undefined) {
        this.retrieveObjectData(objects[id], null, fields);
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

  handleObjectDragEnter = (id) => () => {
    let { ordering, dragObject } = this.state;
    if (dragObject !== null && id !== dragObject.value) {
      let current = ordering.indexOf(dragObject.value);
      let target = ordering.indexOf(id);
      ordering[current] = id;
      ordering[target] = dragObject.value;
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

  handleFilterChange = (filter) => (event) => {
    let { selectedFilters } = this.state;
    selectedFilters[filter] = event.target.value;
    this.setState({ selectedFilters });
  };

  handleFilterAdd = (obj, filters) => () => {
    this.retrieveObjectData(obj, filters);
  };

  handleFilterClose = () => {
    this.setState({ filterOpen: false });
  };

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

  getObjectHeader = (ordering, objects, fields, addFieldButton) => {
    const { classes } = this.props;
    let cells = [];
    const fieldMenu = this.getFieldMenu(fields, addFieldButton)
    if (ordering.length !== 2) {
      cells.push(<TableCell style={{zIndex: 2}} key='add-field' className={classes.tableCell}>{fieldMenu}</TableCell>);
    }
    for (let i = 0; i < ordering.length; i++) {
      let id = ordering[i];
      let obj = objects[id]
      if (i === 1 && ordering.length === 2) {
        cells.push(<TableCell style={{zIndex: 2}} key={i} className={classes.tableCell}>{fieldMenu}</TableCell>);
      }
      cells.push(
        <TableCell
          key={id}
          component="th"
          className={classes.tableCell}
          draggable={true}
          onDragEnter={this.handleObjectDragEnter(id)}
          onDragStart={this.handleObjectDrag(id)}
          onDragEnd={this.handleDragEnd("Object")}>
          <ObjectCard handleCloseClick={this.removeObject(id)} handleFilterClick={this.handleEditObjectFilters(obj)} {...obj}/>
        </TableCell>);
    }
    return <TableRow className={classes.tableHeadRow}>{cells}</TableRow>;
  };

  getFieldHeader = (fields, addFieldButton) => {
    const { classes } = this.props;
    return (
      <TableRow className={classes.tableHeadRow}>
        <TableCell style={{zIndex: 2}} className={classes.tableCell} component="th">{this.getFieldMenu(fields, addFieldButton)}</TableCell>
        {fields.map((f, i) => {
          return (
            <TableCell
              key={i}
              component="th"
              className={classes.tableCell}
              onDoubleClick={this.handleFieldDoubleClick(f)}
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

  getObjectRow = (obj, fields) => {
    const { classes } = this.props;
    return (
      <TableRow key={obj.id} className={classes.tableRow} draggable={true} onDragEnter={this.handleObjectDragEnter(obj.id)} onDragStart={this.handleObjectDrag(obj.id)} onDragEnd={this.handleDragEnd("Object")}>
        <TableCell className={classes.tableCell} component="th">
          <ObjectCard handleCloseClick={this.removeObject(obj.id)} handleFilterClick={this.handleEditObjectFilters(obj)} {...obj}/>
        </TableCell>
        {fields.map((f, i) => <TableCell key={i} style={{ textAlign: "left" }} className={classes.tableBodyCell}>{obj[f]}</TableCell>)}
      </TableRow>
    );
  };

  getFieldRow = (field, ordering, objects) => {
    const { classes } = this.props;
    let cells = [];
    if (ordering.length !== 2) {
      cells.push(
        <TableCell
          key={`1-${field}`}
          className={classes.tableCell}
          component="th"
          onDoubleClick={this.handleFieldDoubleClick(field)}>
          {toTitleCase(field)}
        </TableCell>);
    }
    for (let i = 0; i < ordering.length; i++) {
      if (i === 1 && ordering.length === 2) {
        cells.push(<TableCell key={`${i}-${field}`} style={{ textAlign: "center" }} className={classes.tableCell} component="th" onDoubleClick={this.handleFieldDoubleClick(field)}>{toTitleCase(field)}</TableCell>);
      }
      cells.push(<TableCell key={i} className={classes.tableBodyCell}>{objects[ordering[i]][field]}</TableCell>);
    }
    return <TableRow key={field} className={classes.tableRow} draggable={true} onDragEnter={this.handleFieldDragEnter(field)} onDragStart={this.handleFieldDrag(field)} onDragEnd={this.handleDragEnd("Field")}>{cells}</TableRow>;
  };

  getObjectCardHeader = (obj) => {
    const { classes, subheader } = this.props;
    const action = <IconButton className={classes.deleteBtn} onClick={this.removeObject(obj.id)}><CloseIcon className={classes.closeIcon} /></IconButton>;
    return (
      <Card onDoubleClick={this.removeObject(obj.id)}>
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
        onDelete={this.removeObject(obj.id)}
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
        onDoubleClick={this.removeObject(obj.id)}
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
    const { classes, comparison_fields } = this.props;
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
          {comparison_fields
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
    const { classes, search, filterFields = [] } = this.props;
    const { ordering, objects, addFieldButton, fields, display, filters, selectedObj, selectedFilters } = this.state;
    let content = <Paper className={classes.defaultContent}>{this.getFieldMenu(fields, addFieldButton)}</Paper>;
    let filterBox = null;
    if (display === "cards") {
      content = <div className={classes.cardContainer}>{ordering.map(id => this.getObjectCard(id, objects[id], fields))}</div>;
    } else if (display === "horizontal") {
      content = <div className={classes.container} ref={this.container} onScroll={this.handleScroll}>
          <Table className={classes.table}>
            <TableHead>{this.getFieldHeader(fields, addFieldButton)}</TableHead>
            <TableBody>{ordering.map(id => this.getObjectRow(objects[id], fields))}</TableBody>
          </Table>
        </div>;
    } else if (display === "vertical") {
      content = <div className={classes.container} ref={this.container} onScroll={this.handleScroll}>
        <Table className={classes.table}>
          <TableHead>{this.getObjectHeader(ordering, objects, fields, addFieldButton)}</TableHead>
          <TableBody>{fields.map(field => this.getFieldRow(field, ordering, objects))}</TableBody>
        </Table>
      </div>;
    }

    if (selectedFilters !== undefined) {
      filterBox = (
        <Dialog
          open={this.state.filterOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Data Filters</DialogTitle>
          <DialogContent>
            {filterFields.map(f => <MultiSelect key={`filter-${f}`} selectedFields={selectedFilters[f]} possibleFields={filters[f]} handleChange={this.handleFilterChange(f)} />)}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleFilterClose} color="primary">
              Cancel
              </Button>
            <Button onClick={this.handleFilterAdd(selectedObj, selectedFilters)} color="primary">
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
        </Toolbar>
        {content}
        {filterBox}
      </div>
    );
  }
}

export default withStyles(styles)(Comparison);
