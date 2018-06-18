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
import sample_suggestions from '../sample_data/player_search';
import sample_teams from '../sample_data/active_teams';

const styles = theme => ({
  container: {
    flexGrow: .2,
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
    padding: "6px 0 7px",
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
    width: 175,
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
    marginRight: 4
  },
  searchContainer2: {
    width: "100%",
    margin: "auto 8px",
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
  const { classes, container, ...other } = props;

  return (
    <div className={classes.searchContainer1} ref={container}>
      <div className={classes.searchContainer2}>
        <div className={classes.searchContainer3}>
          <input className={classes.input} {...other} type="text"/>
        </div>
      </div>
    </div>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem button selected={isHighlighted} component="a" href={suggestion.url}>
      <Avatar alt={suggestion.name} src={suggestion.image} />
      <ListItemText>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 200 }}>
              {part.text}
            </strong>
          );
        })}
      </ListItemText>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  let { containerProps, children } = options;
  
  return (
    <Paper {...containerProps} square>
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
    let { suggestions, originalSuggestions } = this.state;

    if (type === "fetch") {
        if (originalSuggestions.length === 0 && inputLength > 4) {
            const dataurl = `${url}${inputValue}/`;
            axios.get(dataurl).then(res => {
              return res.data;
            }).catch(error => {
              return sample_suggestions;
            }).then(data => {
              this.setState({
                originalSuggestions: data,
              });
            });
        } else if (inputLength > 4) {
            this.setState({
              suggestions: getSuggestions(originalSuggestions, inputValue),
            });
        } else {
            this.setState({
                originalSuggestions: [],
            });
        }
    } else {
        if (type === "load" && originalSuggestions.length === 0) {
            axios.get(url).then(res => {
              return res.data;
            }).catch(error => {
              return sample_teams;
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

  handleFocus = () => {
    this.container.current.style.width = "250px";
    this.container.current.style.outline = "2px solid #0099ff";
    this.container.current.style.backgroundColor= "#fff";
  };

  handleBlur = () => {
    this.container.current.style.width = "175px";
    this.container.current.style.outline = "0";
    this.container.current.style.backgroundColor= "#ddd";
  };

  render() {
    const { classes, label } = this.props;
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
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          container: this.container,
          placeholder: `Search for ${label}...`,
          value: this.state.value,
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
        }}
      />
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar);