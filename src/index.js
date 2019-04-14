import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Navbar from './Navbar';
import Home from './pages/Home';
import Scores from './pages/DailyScores';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import { darkTheme } from './theme.js';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fab);

const theme = darkTheme;

const domMounts = {
    home: Home,
    daily_scores: Scores,
};

Object.keys(domMounts).forEach(mountId => {
    const Component = domMounts[mountId];
    const placeholderElement = document.getElementById(mountId);
    if (placeholderElement) {
        ReactDOM.render(
            <MuiThemeProvider theme={theme}>
                <Paper style={{padding: `70px ${theme.spacing.unit}px ${theme.spacing.unit}px`, minHeight: 'calc(100% - 70px)'}} square>
                    <Navbar/>
                    <Component/>
                </Paper>
            </MuiThemeProvider>, 
            document.getElementById(mountId)
        );
        return false;
    }
});

const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.render(<MuiThemeProvider theme={theme}><App/></MuiThemeProvider>, document.getElementById('root'));
}

registerServiceWorker();
