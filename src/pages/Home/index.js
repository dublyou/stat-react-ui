import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { withWindowSize } from 'react-fns';
import Article from './components/Article';
import Headlines from './components/Headlines';
import TwitterTimeline from './components/TwitterTimeline';
import LoadMore from '../../components/LoadMore';
import Navbar from '../../Navbar';
import { getArticles } from '../../api/articles';
import startCase from 'lodash/startCase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

const styles = theme => ({
  root: {
    paddingTop: 70,
    borderRadius: 0,
  },
});

class HomeContainer extends React.Component {
    state = {
        data: [],
        tab: 'articles'
    }

    componentDidMount() {
        getArticles(0, 100).then(res => {
            this.setState({
                data: res.data,
            });
        });
    }

    handleChangeTab = (e, tab) => {
        this.setState({tab});
    };

	render() {
        const { classes, width } = this.props;
        const { data, tab } = this.state;
        const components = {
            twitter: {
                component: TwitterTimeline, 
                props: {handle: '@statdive', link: 'https://twitter.com/statdive?ref_src=twsrc%5Etfw'}, 
                gridProps: {xs: 3}, 
                tabProps: {icon: <FontAwesomeIcon icon={['fab', 'twitter']}/>, label: 'Tweets'}
            },
            articles: {component: LoadMore, props: {component: Article, data}, gridProps: {xs: 6}},
            news: {component: Headlines, props: {articles: data}, gridProps: {xs: 3}, tabProps: {icon: <FontAwesomeIcon icon={faNewspaper}/>}},
        }
		
		return (
            <Paper className={classes.root}>
                <Navbar/>
                {width > 800 ? (
                    <Grid container justify="center" spacing={8} >
                        {Object.keys(components).map(value => {
                            const component = components[value];
                            const Component = component.component;
                            return (
                                <Grid key={value} item {...component.gridProps}>
                                    <Component {...component.props}/>
                                </Grid>
                            )
                        })}
                    </Grid>
                ): (
                    <React.Fragment>
                        <Tabs
                            value={tab}
                            onChange={this.handleChangeTab}
                            variant="fullWidth"
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            {Object.keys(components).map(value => {
                                const component = components[value];
                                return (
                                    <Tab 
                                        key={value} 
                                        label={startCase(value)}
                                        value={value}
                                        {...component.tabProps}
                                    />
                                );
                            })}
                        </Tabs>
                        {Object.keys(components).map(value => {
                            const component = components[value];
                            const Component = component.component;
                            return (
                                <div key={value} style={{display: value === tab ? 'block' : 'none'}}>
                                    <Component {...component.props}/>
                                </div>
                            )
                        })}
                    </React.Fragment>
                )}
                
            </Paper>
		);
	}
}

export default withStyles(styles)(withWindowSize(HomeContainer));