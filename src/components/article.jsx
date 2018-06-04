import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import OpenInNew from '@material-ui/icons/OpenInNew';

/*data = [
{"authors": ["Dionysis Aravantinos"], "description": null, "image_url": "https://www.eurohoops.net/wp-content/uploads/2018/05/doncic_real_cska-600x314.jpg", "keywords": null, "publish_date": "2018/05/18 11:12 PM", "source": "eurohoops.net/en/euroleague/678699/luka-doncic-with-the-best-u-20-performance-in-final-four-history/?utm_campaign=Echobox&utm_medium=Social&utm_source=Twitter", "summary": "", "title": "Luka Doncic with the best U-20 performance in Final Four history", "url": "https://www.eurohoops.net/en/euroleague/678699/luka-doncic-with-the-best-u-20-performance-in-final-four-history/?utm_campaign=Echobox&utm_medium=Social&utm_source=Twitter"}, 
{"authors": [], "description": "Kansas City seems to have joined Seattle on the short list for an NBA expansion team.", "image_url": "https://s.yimg.com/ny/api/res/1.2/krXvTdG7o03_wbU7BNh65w--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyODA7aD02NjguOA--/https://s.yimg.com/uu/api/res/1.2/7Cy29VY9XUQA8VbsG2mbIw--~B/aD0yNDkyO3c9NDc2ODtzbT0xO2FwcGlkPXl0YWNoeW9u/http://media.zenfs.com/en/homerun/feed_manager_auto_publish_494/d754af9cf1aa487abf5c720e6b74bf4f", "keywords": null, "publish_date": "2018/05/18 10:30 PM", "source": "sports.yahoo.com/nba-executive-kansas-city-will-get-nba-team-point-233932993.html", "summary": "", "title": "NBA executive: Kansas City will get NBA team 'at some point'", "url": "https://sports.yahoo.com/nba-executive-kansas-city-will-get-nba-team-point-233932993.html"}, 
{"authors": ["Dave Mcmenamin", "Nick Depaula"], "description": "Phoenix Suns general manager Ryan McDonough says he hasn't ruled out the option of dealing away the No. 1 pick in June's draft for a lower pick -- or even a worthy veteran player.", "image_url": "http://a4.espncdn.com/combiner/i?img=%2Fphoto%2F2018%2F0515%2Fr371108_1296x729_16%2D9.jpg", "keywords": "trade, no. 1 pick, top pick, gm, general manager, ryan mcdonough, nba draft lottery, marvin bagley iii, NBA, NBA Draft, DeAndre Ayton, Luka Doncic, Phoenix Suns, Atlanta Hawks, Sacramento Kings", "publish_date": "2018/05/18 08:15 PM", "source": "espn.com/nba/story/_/id/23540668/phoenix-suns-general-manager-ryan-mcdonough-certainly-open-dealing-no-1-pick", "summary": "", "title": "Phoenix Suns general manager Ryan McDonough 'certainly open' to dealing No. 1 pick", "url": "http://www.espn.com/nba/story/_/id/23540668/phoenix-suns-general-manager-ryan-mcdonough-certainly-open-dealing-no-1-pick"},
];*/

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
    const { classes, url, source, publish_date, title, authors, image_url, description, summary, width, key } = this.props;
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