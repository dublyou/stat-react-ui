import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { newsIcons } from '../helpers';
import theme from '../../../theme';
import { compare, isEnterPressed } from '../../../helpers';
import FuzzySet from 'fuzzyset.js';
import find from 'lodash/find';


const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.background.default,
    },
    actions: {
        justifyContent: 'center',
        padding: 0,
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 0,
        [theme.breakpoints.down('md')]: {
            width: 16,
            height: 16,
        },
        [theme.breakpoints.down('sm')]: {
            width: 12,
            height: 12,
        },
        [theme.breakpoints.down('xs')]: {
            width: 20,
            height: 20,
        },
    },
    content: {
        padding: theme.spacing.unit/2,
        minHeight: 600,
        [theme.breakpoints.down('xs')]: {
            minHeight: 400,
        }
    },
    header: {
        borderBottom: theme.palette.text.secondary,
        backgroundColor: theme.palette.grey[900],
    },
    headerRoot: {
        padding: theme.spacing.unit/2,
        textAlign: "center",
    },
    headerTitle: {
      fontSize: "1rem",
    },
    listItem: {
        padding: theme.spacing.unit/2,
        minHeight: 48,
        [theme.breakpoints.down('md')]: {
            minHeight: 44
        },
        [theme.breakpoints.down('sm')]: {
            minHeight: 40
        },
        [theme.breakpoints.down('xs')]: {
            minHeight: 48
        },
    },
    listItemText: {
        paddingRight: 0,
        paddingLeft: theme.spacing.unit,
    },
    listItemTextPrimary: {
        fontSize: '.8rem',
        fontWeight: 300,
        [theme.breakpoints.down('md')]: {
            fontSize: '.65rem'
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: '.5rem'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '.8rem'
        }
    },
    tab: {
        minWidth: 'auto',
    },
    labelContainer: {
        padding: theme.spacing.unit/2
    },
    notchedOutline: {
        backgroundColor: '#fff',
    },
    input: {
        zIndex: 4,
        padding: theme.spacing.unit
    },
    inputBase: {
        paddingRight: theme.spacing.unit/2,
        width: 'auto',
    },
    textField: {
        marginTop: theme.spacing.unit
    }
});

const getSource = source => {
    const match = source.match(/((?:(?![.]).)*)[.](?:co|com|net)$/);
    if (match && match.length > 1) {
        return match[1];
    }
    return source;
}

class Headlines extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: this.getArticles(props.articles),
            source: 'all',
            page: 1,
            perPage: 10,
            searchKeyword: '',
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.articles.length !== this.props.articles.length) {
            this.setState({
                articles: this.getArticles(this.props.articles),
            });
        }
    }

    getArticles = (articles, source) => {
        articles = articles.map(article => ({...article, source: getSource(article.source)}));
        if (source && source !== 'all') {
            return articles.filter(article => article.source === source)
        }
        return articles;
    }

    handleChange = (e, source) => {
        const { searchKeyword } = this.state;
        const articles = this.getSearchResults(this.getArticles(this.props.articles, source), searchKeyword);
        this.setState({
            articles,
            page: 1,
            source,
        });
    }

    handleSearchClick = e => {
        this.setState((state) => {
            const { articles, searchKeyword, source } = state;
            return {
                articles: this.getSearchResults(searchKeyword ? this.getArticles(this.props.articles, source) : articles, searchKeyword)
            }
        });
    };

    handleSearchKeyPress = e => {
        if (isEnterPressed(e)) {
            this.handleSearchClick(e);
        }
    }

    handleClearSearch = e => {
        this.setState({
            searchKeyword: '',
        }, () => this.handleChange(e, this.state.source));
    }

    handleSearchChange = e => {
        this.setState({
            searchKeyword: e.target.value,
        });
    }

    getSearchResults = (articles, keyword) => {
        if (keyword) {
            const a = FuzzySet(articles.map(article => article.title));
            const results = a.get(keyword, [], 0.1).sort(compare);
            return results.map(result => {
                return find(articles, article => article.title === result[1]);
            });
        }
        return articles;
    }

    changePage = increment => e => {
        this.setState((state) => ({page: state.page + increment}));
    }
    
    render() {
        const { classes, showHeader=false } = this.props;
        const { articles, page, perPage, searchKeyword, source } = this.state;
        const slicedArticles = articles.slice((page - 1) * perPage, page * perPage);
        const showPagePrev = page > 1;
        const showPageNext = perPage * page < articles.length;
        return (
            <Card className={classes.root}>
  				{showHeader && <CardHeader className={classes.header} classes={{root: classes.headerRoot, title: classes.headerTitle}} title='News'/>}
  				<CardContent className={classes.content}>
                    <Tabs
                        value={source}
                        onChange={this.handleChange}
                        variant="fullWidth"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label='All' value='all' classes={{root: classes.tab, labelContainer: classes.labelContainer}}/>
                        {Object.keys(newsIcons).map(newsSource => (
                            <Tab 
                                key={newsSource} 
                                icon={<Avatar className={classes.avatar} src={newsIcons[newsSource]}/>} 
                                value={newsSource} 
                                classes={{root: classes.tab, labelContainer: classes.labelContainer}}
                            />
                        ))}
                    </Tabs>
                    <MuiThemeProvider theme={theme}>
                        <TextField 
                            variant='outlined'
                            fullWidth={true}
                            className={classes.textField}
                            onChange={this.handleSearchChange}
                            onKeyPress={this.handleSearchKeyPress}
                            value={searchKeyword}
                            InputProps={{
                                classes: {
                                    input: classes.input,
                                    notchedOutline: classes.notchedOutline,
                                    root: classes.inputBase,
                                },
                                inputProps: {
                                    placeholder: 'Search news...'
                                },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {searchKeyword && (
                                            <IconButton
                                                onClick={this.handleClearSearch}
                                            >
                                                <CloseIcon/>
                                            </IconButton>
                                        )}
                                        <IconButton
                                            onClick={this.handleSearchClick}
                                        >
                                            <SearchIcon/>
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </MuiThemeProvider>
  					<List>
                          {slicedArticles.map((article, i) => (
                                <ListItem button className={classes.listItem} component='a' divider={true} href={article.url} key={i} target='_blank' title={article.title}>
                                    {source === 'all' && <Avatar src={newsIcons[getSource(article.source)]} className={classes.avatar}/>}
                                    <ListItemText className={classes.listItemText} primary={article.title} primaryTypographyProps={{variant: 'subtitle2', className: classes.listItemTextPrimary}}/>
                                </ListItem>
                          ))}
                    </List>
  				</CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton onClick={showPagePrev ? this.changePage(-1) : undefined} style={{visibility: showPagePrev ? 'visible' : 'hidden'}}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography>Page: {page}</Typography>
                    <IconButton onClick={showPageNext ? this.changePage(1) : undefined} style={{visibility: showPageNext ? 'visible' : 'hidden'}}>
                        <ChevronRightIcon />
                    </IconButton>
                </CardActions>
  			</Card>
        );
    }
}

Headlines.propTypes = {
    classes: PropTypes.object.isRequired,
    articles: PropTypes.array.isRequired,
}

export default withStyles(styles, {withTheme: true})(Headlines);