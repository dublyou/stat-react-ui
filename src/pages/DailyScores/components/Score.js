import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Row, Col } from 'react-flexa';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import ObjectLink from './ObjectLink';
import Team from './Team';
import { getUrl } from '../../../utils/url';


const styles = theme => ({
    root: {
        margin: '1rem',
    },
    smallButton: {
        minWidth: 50,
        minHeight: 25,
        fontSize: '.5rem',
    }
});

class Score extends React.Component {
	render() {
		const { classes, away_team, home_team, stat_leaders, url } = this.props;
		return (
            <Paper className={classes.root}>
                <Row alignItems='center'>
                    <Col xs={0} sm={6.5} md={6}>
                        <List>
                            <Team {...away_team}/>
                            <Team {...home_team}/>
                        </List>
                    </Col>
                    <Col xs={9.5} sm={0} md={0}>
                        <List>
                            <Team dense={true} {...away_team}/>
                            <Team dense={true} {...home_team}/>
                        </List>
                    </Col>
                    <Col xs={0} sm={4}>
                        <List>
                            {stat_leaders.map((leader, i) => {
                                const { image, url } = leader;
                                return <ObjectLink key={i} image={image} primary={leader.name} secondary={`${leader.value} ${leader.stat}`} href={url} dense={true}/>;
                            })}
                        </List>
                    </Col>
                    <Col xs={1.5} sm={0} md={0}>
                        <Button size='small' variant='contained' className={classes.smallButton} component='a' href={getUrl(url)}>Details</Button>
                    </Col>
                    <Col xs={0} sm={1.5} md={0}>
                        <Button variant='contained' component='a' href={getUrl(url)}>Details</Button>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2}>
                        <Button size='large' variant='contained' component='a' href={getUrl(url)}>Details</Button>
                    </Col>
                </Row>
            </Paper>
            
        )
	}
}

export default withStyles(styles)(Score);