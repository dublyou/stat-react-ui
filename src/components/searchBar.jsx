import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

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
    height: 40,
    display: "flex",
    justifyContent: "space-between",
    boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
    borderRadius: 2,
    backgroundColor: "#ddd",
    "&:hover": {
      backgroundColor: "#fff"
    }
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

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function searchInput(props) {
  const { classes, ...other } = props;
  return (
    <div className={classes.searchContainer1}>
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
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          );
        })}
      </ListItemText>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function getSuggestions(suggestions, value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  if (inputLength > 0) {
    return suggestions.filter(suggestion => {
      const suggestionParts = suggestion.name.split(" ");
      suggestionParts.unshift(suggestion.name);
      for (let part of suggestionParts) {
        part = part.toLowerCase().slice(0, inputLength);
        if (part === inputValue) {
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
    const { url, type } = props;
    let suggestions = [];
    if (type == "load") {
      axios.get(url).then(res => {
        suggestions = res;
      });
    }
    this.state = {
        value: '',
        suggestions: [],
        originalSuggestions: suggestions,
    };
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    const { url, type } = this.props;
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    let { suggestions, originalSuggestions } = this.state;
    if (type == "fetch") {
      if (inputLength > 5) {
        suggestions = getSuggestions(originalSuggestions, inputValue);
      } else if (inputLength > 4) {
        const dataurl = `${url}${inputValue}/`;
        axios.get(dataurl).then(res => {
          suggestions = res;
        });
        this.setState({
          originalSuggestions: suggestions,
        });
      }
    } else {
      suggestions = getSuggestions(originalSuggestions, inputValue);
    }
    
    this.setState({
      suggestions: suggestions,
    });
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
          placeholder: `Search for ${label}...`,
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar);