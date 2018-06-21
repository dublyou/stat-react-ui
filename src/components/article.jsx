import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import OpenInNew from '@material-ui/icons/OpenInNew';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  source: {
    color: "#fff",
    flex: 1,
  }
});

class Article extends React.Component {

  render() {
    const { classes, url, source, publish_date, title, image_url, description, summary, width } = this.props;
    const MyLink = props => <a target="_blank" href={url} {...props}>{props.children}</a>;
    const card_size = {width: width || "100%", borderBottom: "1px solid #fff"}
    const image = (image_url !== null) ? <CardMedia className={classes.media} image={image_url} title={image_url}/> : "";

    return (
        <Card className={classes.root} style={card_size}>
          <CardHeader
            action={
              <IconButton component={MyLink}>
                <OpenInNew />
              </IconButton>
            }
            title={title}
            subheader={publish_date}
          />
          {image}
          <CardContent>
            <Typography component="p">{description || summary}</Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <a className={classes.source} target="_blank" href={`http://${source}`}>{source}</a>
            <Button component={MyLink}>Go&nbsp;to&nbsp;article</Button>
          </CardActions>
        </Card>
    );
  }
}

export default withStyles(styles)(Article);