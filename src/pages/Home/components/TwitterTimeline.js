import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
    root: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.background.default
    },
});

class TwitterTimeline extends React.Component {

    componentDidMount() {
        const aScript = document.createElement('script');
        aScript.type = 'text/javascript';
        aScript.src = "https://platform.twitter.com/widgets.js";
        aScript.onload = this.setTwitterBackground(0);
        document.head.appendChild(aScript);
    }

    setTwitterBackground = (count) => () => {
        const theme = this.props.theme;
        const widgets = document.querySelectorAll('*[id^="twitter-widget-"]');
        if (widgets.length > 0) {
            const widget = widgets[0];
            const widgetCSS = `.timeline-Widget{background-color: ${theme.palette.background.default} !important;}`;
            const w = widget.contentDocument;
            const s = document.createElement("style");
            s.innerHTML = widgetCSS;
            s.type = "text/css";
            w.head.appendChild(s);
        } else if (count < 10) {
            setTimeout(this.setTwitterBackground(count + 1), 500);
        }
    }
    
    render() {
        const { classes, handle, link } = this.props;
        return (
            <Paper className={classes.root}><a className="twitter-timeline" data-theme="dark" data-link-color="#F5F8FA" href={link}>Tweets by {handle}</a></Paper>
        )
    }
}

TwitterTimeline.propTypes = {
    classes: PropTypes.object.isRequired,
    handle: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired
}

export default withStyles(styles, {withTheme: true})(TwitterTimeline);