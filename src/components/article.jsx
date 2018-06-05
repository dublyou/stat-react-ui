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
  card: {
    maxWidth: 800,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
});

class Article extends React.Component {

  render() {
    const { classes, url, source, publish_date, title, image_url, description, summary, width } = this.props;
    const MyLink = props => <a target="_blank" href={url} {...props}>{props.children}</a>;
    const card_size = {width: width || "100%"}

    return (
      <div>
        <Card style={card_size}>
          <CardHeader
            action={
              <IconButton component={MyLink}>
                <OpenInNew />
              </IconButton>
            }
            title={title}
            subheader={publish_date}
          />
          <CardMedia
            className={classes.media}
            image={image_url}
            title={title}
          />
          <CardContent>
            <Typography component="p">{description || summary}</Typography>
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <Typography target="_blank" to={source} component={MyLink} >{source}</Typography>
            <Button component={MyLink}>Go&nbsp;to&nbsp;article</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(Article);