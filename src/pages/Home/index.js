import React from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Article from './components/Article';
import Headlines from './components/Headlines';
import TwitterTimeline from './components/TwitterTimeline';
import LoadMore from '../../components/LoadMore';
import { withWindowSize } from 'react-fns';
import { getArticles } from '../../api/articles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import startCase from 'lodash/startCase';

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
        const { width } = this.props;
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
        
        if (width > 800) {
            return (
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
            );
        }
		return (
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
		);
	}
}

export default withWindowSize(HomeContainer);