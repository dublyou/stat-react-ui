import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Home from './pages/Home';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { darkTheme } from './theme.js';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

library.add(fab);


const domMounts = {
    home: Home,
};

Object.keys(domMounts).forEach(mountId => {
    const Component = domMounts[mountId];
    const placeholderElement = document.getElementById(mountId);
    if (placeholderElement) {
        ReactDOM.render(
            <MuiThemeProvider theme={darkTheme}>
                <Component/>
            </MuiThemeProvider>, 
            document.getElementById(mountId)
        );
    }
});

ReactDOM.render(<MuiThemeProvider theme={darkTheme}><Home/></MuiThemeProvider>, document.getElementById('root'));
registerServiceWorker();
