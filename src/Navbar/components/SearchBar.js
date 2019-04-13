import React from 'react';
import Autosuggest from 'react-autosuggest';
import PropTypes from 'prop-types';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import FuzzySet from 'fuzzyset.js';
import { getUrl, getImage } from '../../utils/url';
import theme, { darkTheme } from '../../theme';
import { compare } from '../../helpers';
import find from 'lodash/find';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  input: {
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit * 1.5,
    }
  },
  notchedOutline: {
    backgroundColor: '#fff',
    zIndex: -1
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
});

function searchInput(props) {
  const { classes, inputRef = () => {}, ref, ...other } = props;

  return (
    <TextField 
      variant='outlined'
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
          notchedOutline: classes.notchedOutline
        }
      }}
      {...other}
    />
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <MuiThemeProvider theme={darkTheme}>
      <Paper {...containerProps} square style={{zIndex: 10}}>
        {children}
      </Paper>
    </MuiThemeProvider>
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);
  const primaryText = parts.map((part, index) => {
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
  const secondaryText = suggestion.subheader;

  return (
    <MenuItem key={suggestion.id || suggestion.name} button selected={isHighlighted} component='span'>
      <Avatar alt={suggestion.name} src={getImage(suggestion.image)} />
      <ListItemText primary={primaryText} secondary={secondaryText}/>
    </MenuItem>
  );
};

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function getSuggestions(suggestions, value, threshold=.5) {
  const a = FuzzySet(suggestions.map(value => value.name));
  const results = (a.get(value) || []).sort(compare).filter(result => result[0] > threshold).slice(0, 5);
  if (value.length > 0) {
    return results.map(result => {
      return find(suggestions, (suggestion) => suggestion.name === result[1]);
    });
  }
  return [];
}

class SearchBar extends React.Component {
  constructor(props) {
      super(props);
      this.container = React.createRef();
      this.state = {
        value: '',
        suggestions: [],
        playerSuggestions: [],
        teamSuggestions: []
    };
  };

  componentDidMount() {
    this.getTeamSuggestions();
  }

  getTeamSuggestions = () => {
    axios.get(getUrl("/teams/data/team_list/")).then(res => {
      this.setState({
        teamSuggestions: res.data,
      });
    });
  }

  getPlayerSuggestions = (value) => {
    axios.get(`${getUrl("/players/search/")}${value}/`).then(res => {
      this.setState({ playerSuggestions: res.data }, this.getSectionSuggestions);
    });
  }

  getSectionSuggestions = () => {
    this.setState((state) => {
      const { playerSuggestions, value } = state;
      const teamSuggestions = getSuggestions(state.teamSuggestions, value, .3);
      const suggestions = [];
      if (teamSuggestions.length > 0) {
        suggestions.push({title: 'Teams', suggestions: teamSuggestions});
      }
      if (playerSuggestions.length > 0) {
        suggestions.push({title: 'Players', suggestions: playerSuggestions.slice(0, 5)});
      }
      return { suggestions };
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleSuggestionsFetchRequested = ({ value='' }) => {
    value = value.trim().toLowerCase();
    if (value.length > 3) {
        this.getPlayerSuggestions(value);
    } else {
        this.handleSuggestionsClearRequested();
    }
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    const { handleClick } = this.props;
    if (suggestion.url) {
      window.location.href = suggestion.url;
    } else {
      handleClick(suggestion);
      setTimeout(() => this.setState({value: ''}), 400);
    }
  };

  handleKeyPress = (event) => {
    if(event.key === 'Enter') {
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
    const { classes, placeholder } = this.props;
    const { suggestions, value } = this.state;
    const inputProps = {
      classes,
      container: this.container,
      placeholder: placeholder || 'Search for a Player or Team...',
      value,
      onChange: this.handleChange,
      onKeyPress: this.handleKeyPress,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
    };
    
    return (
      <MuiThemeProvider theme={theme}>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={searchInput}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          highlightFirstSuggestion={true}
          renderSuggestionsContainer={renderSuggestionsContainer}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          multiSection={true}
          renderSectionTitle={section => <ListSubheader>{section.title}</ListSubheader>}
          getSectionSuggestions={(section => section.suggestions)}
        />
      </MuiThemeProvider>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
};

export default withStyles(styles)(SearchBar);