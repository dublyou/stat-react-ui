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
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    margin: `${theme.spacing.unit}px 0`
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  source: {
    flex: 1,
  }
});

class Article extends React.Component {

  render() {
    const { classes, url, source, publish_date, title, image_url, description, summary } = this.props;

    return (
        <Card className={classes.root}>
          <CardHeader
            action={
              <IconButton component='a' href={url} target='_blank'>
                <OpenInNewIcon />
              </IconButton>
            }
            title={<Typography variant='h6'>{title}</Typography>}
            subheader={publish_date}
          />
          {image_url && <CardMedia className={classes.media} image={image_url} title={image_url}/>}
          <CardContent>
            <Typography variant='body2' color='textSecondary'>{description || summary}</Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Typography component='a' className={classes.source} target="_blank" href={`http://${source}`} variant='subtitle1'>{source}</Typography>
            <Button variant='outlined' component='a' href={url} target='_blank'>Go&nbsp;to&nbsp;article</Button>
          </CardActions>
        </Card>
    );
  }
}

export default withStyles(styles)(Article);