import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

const defaultSuggestions = [
  {label: 'Michael Zeno', url: '/players/id/'},
  {label: 'Michael Redd', url: '/players/id/'},
  {label: 'Michael Tait', url: '/players/id/'},
  {label: 'Michael Cage', url: '/players/id/'},
  {label: 'Michael Eric', url: '/players/id/'},
  {label: 'Michael Pitts', url: '/players/id/'},
  {label: 'Michael Payne', url: '/players/id/'},
  {label: 'Michael Smith', url: '/players/id/'},
  {label: 'Michael Britt', url: '/players/id/'},
  {label: 'Michael Curry', url: '/players/id/'},
  {label: 'Michael Young', url: '/players/id/'},
  {label: 'Michael Wiley', url: '/players/id/'},
  {label: 'Michael Smith', url: '/players/id/'},
  {label: 'Michael Adams', url: '/players/id/'},
  {label: 'Michael Ruffin', url: '/players/id/'},
  {label: 'Michael Ansley', url: '/players/id/'},
  {label: 'Michael Brooks', url: '/players/id/'},
  {label: 'Michael Cooper', url: '/players/id/'},
  {label: 'Michael Doleac', url: '/players/id/'},
  {label: 'Michael Finley', url: '/players/id/'},
  {label: 'Michael Phelps', url: '/players/id/'},
  {label: 'Michael Wilson', url: '/players/id/'},
  {label: 'Michael Thomas', url: '/players/id/'},
  {label: 'Michael Graham', url: '/players/id/'},
  {label: 'Michael McCombs', url: '/players/id/'},
  {label: 'Michael Gerren', url: '/players/id/'},
  {label: 'Michael Mitchell', url: '/players/id/'},
  {label: 'Michael Wright', url: '/players/id/'},
  {label: 'Michael Foster', url: '/players/id/'},
  {label: 'Michael Vicens', url: '/players/id/'},
  {label: 'Michael Qualls', url: '/players/id/'},
  {label: 'Michael Jordan', url: '/players/id/'},
  {label: 'Michael Jackson', url: '/players/id/'},
  {label: 'Michael Edwards', url: '/players/id/'},
]

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

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <a href={suggestion.url}>
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
      </a>
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
  return suggestion.label;
}

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
});

class SearchBox extends React.Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    const { url } = this.props;
    const inputValue = value.trim().toLowerCase();
    let suggestions = defaultSuggestions;
    if (url) {
      const dataurl = `${url}${inputValue}/`;
      suggestions = this.state.suggestions;
      axios.get(dataurl).then(res => {
        suggestions = res;
      });
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
    const { classes, object_name } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          placeholder: `Search for a ${object_name}`,
          value: this.state.value,
          onChange: this.handleChange,
        }}
      />
    );
  }
}

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBox);