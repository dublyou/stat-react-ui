import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import FuzzySet from 'fuzzyset.js';
import { getUrl, getImage } from '../utils/url';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    maxHeight: 300,
    overflow: "auto"
  },
  input: {
    font: "inherit",
    border: 0,
    margin: 0,
    padding: ".35rem 0 .4rem",
    display: "block",
    minWidth: 0,
    flexGrow: 1,
    boxSizing: "content-box",
    background: "none",
    verticalAlign: "middle",
    "&:focus": {
      outline: "none",
    }
  },
  searchContainer1: {
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
    borderRadius: 2,
    outline: 0,
    backgroundColor: "#ddd",
    "&:hover": {
      backgroundColor: "#fff"
    },
    marginRight: 4,
    transition: "all .5s ease"
  },
  searchContainer2: {
    width: "100%",
    margin: "auto .5rem",
  },
  searchContainer3: {
    width: "100%",
    color: "rgba(0, 0, 0, 0.87)",
    display: "inline-flex",
    position: "relative",
    fontSize: "1rem",
    lineHeight: "1.1875em",
  }
});

function searchInput(props) {
  const { classes, container, width, ...other } = props;

  return (
    <div style={{width}} className={classes.searchContainer1} ref={container}>
      <div className={classes.searchContainer2}>
        <div className={classes.searchContainer3}>
          <input className={classes.input} {...other} type="text"/>
        </div>
      </div>
    </div>
  );
}

function renderSuggestionsContainer(options) {
  let { containerProps, children } = options;
  
  return (
    <Paper {...containerProps} square style={{zIndex: 10}}>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function compare(a, b) {
    if (a[0] < b[0])
      return 1;
    if (a[0] > b[0])
      return -1;
    return 0;
}


function getSuggestions(suggestions, value, threshold=.5) {
  const a = FuzzySet(suggestions.map(value => value.name));
  let results = a.get(value) || [];
  results = results.sort(compare).slice(0, 5);
  if (value.length > 0) {
    return suggestions.filter(suggestion => {
      for (let result of results) {
        if (result[0] > threshold && suggestion.name === result[1]) {
          return true;
        }
      }
      return false;
    });
  }
  return [];
}

class SearchBar extends React.Component {
  constructor(props) {
      super(props);
      this.container = React.createRef();
      const { type } = this.props;
      this.state = {
        value: '',
        suggestions: [],
        originalSuggestions: [],
        type,
    };
  }

  componentDidUpdate() {
    const { type } = this.props;
    if (this.state.type !== type) {
      this.setState({
        type,
        value: '',
        suggestions: [],
        originalSuggestions: [],
      });
    }
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    const { url, type } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = value.length;
    let { originalSuggestions } = this.state;
    if (type === "fetch") {
        if (inputLength > 2) {
            const dataurl = `${getUrl(url)}${inputValue}/`;
            axios.get(dataurl).then(res => {
              return res.data;
            }).catch(error => {
              return [];
            }).then(data => {
              this.setState({
                originalSuggestions: data,
                suggestions: data.slice(0, 5),
              });
            });
        } else {
            this.setState({
                originalSuggestions: [],
                suggestions: [],
            });
        }
    } else {
        if (type === "load" && originalSuggestions.length === 0) {
            axios.get(getUrl(url)).then(res => {
              return res.data;
            }).catch(error => {
              return [];
            }).then(data => {
              this.setState({
                originalSuggestions: data,
              });
            });
            originalSuggestions = this.state.originalSuggestions;
        }
        if (inputLength > 4) {
          this.setState({
            suggestions: getSuggestions(originalSuggestions, inputValue, .3),
          });
        } else {
          this.setState({
            suggestions: originalSuggestions,
          });
        }
        
    }
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const { handleClick } = this.props;
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);
    const props = {};
    props.component = "span";
    if (handleClick !== undefined) {
      props.onClick = this.handleClick(suggestion);
    } else {
      props.href = suggestion.url;
      props.component = "a";
    }

    let primaryText = parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 200 }}>
                {part.text}
              </strong>
            );
          });
    let secondaryText = (suggestion.subheader !== undefined) ? suggestion.subheader : null;

    return (
      <MenuItem key={suggestion.id || suggestion.name} button selected={isHighlighted} {...props}>
        <Avatar alt={suggestion.name} src={getImage(suggestion.image)} />
        <ListItemText primary={primaryText} secondary={secondaryText}/>
      </MenuItem>
    );
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  handleClick = (suggestion) => () => {
    const { handleClick } = this.props;
    handleClick(suggestion);
    setTimeout(() => this.setState({value: ''}), 400);;
  };

  handleFocus = () => {
    const { growOnFocus=true } = this.props;
    if (growOnFocus) {
      this.container.current.style.width = "15rem";
    }
    this.container.current.style.outline = ".2rem solid #0099ff";
    this.container.current.style.backgroundColor= "#fff";
  };

  handleBlur = () => {
    const { growOnFocus=true } = this.props;
    if (growOnFocus) {
      this.container.current.style.width = "10rem";
    }
    this.container.current.style.outline = "0";
    this.container.current.style.backgroundColor= "#ddd";
  };

  handleKeyPress = (event) => {
    if(event.key == 'Enter') {
      let suggestions = this.state.originalSuggestions;
      if (suggestions.length > 0) {
        let { handleClick } = this.props;
        const value = event.target.value;
        const filteredSuggestions = suggestions.filter(suggestion => suggestion.name === value);
        if (filteredSuggestions.length > 0) {
          suggestions = filteredSuggestions;
        }
        if (handleClick !== undefined) {
          this.handleClick(suggestions[0])();
        } else {
          window.location.href = suggestions[0].url;
        }
      }
    }
  };

  render() {
    const { classes, label, placeholder, width } = this.props;
    let inputProps = {
      classes,
      container: this.container,
      placeholder: placeholder || `Search for ${label}...`,
      value: this.state.value,
      onChange: this.handleChange,
      onKeyPress: this.handleKeyPress,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      width: width || "10rem",
    }

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={searchInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default withStyles(styles)(SearchBar);