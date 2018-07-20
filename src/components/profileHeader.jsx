import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Hidden from '@material-ui/core/Hidden';
import DetailList from './detailList';
import Accordion from './accordion';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CustomCard from './customCard';
import SimpleList from './simpleList';
import SummaryTable from './summaryTable';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
  root: {
  	padding: 5,
  	borderRadius: 0,
  },
  accordionContainer: {
  	display: "flex",
  	flex: "1 1 auto",
  },
  accordion: {
  	maxWidth: "30rem",
  	margin: "auto",
  },
  card: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  details: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  image: {
  	width: "11rem",
   	height: "11rem",
  },
  cardMedia: {
  	boxShadow: "none"
  },
  cover: {
    width: "4rem",
    height: "4rem",
  },
  content: {
  	padding: 10,
  	"&:last-child": {
  		paddingBottom: 16
  	}
  },
  detailList: {
  	padding: ".2rem",
  	minWidth: "12rem",
  },
  detailItem: {
  	
  },
  detailItemLabel: {
  	fontSize: ".8rem"
  },
  heading: {
  	color: theme.palette.text.primary,
  	whiteSpace: "nowrap",
  },
  headingContainer: {
  	display: "flex",
  },
  headingDetailsContainer: {
  	width: "100%",
  	alignSelf: "center",
  },
  headingDetails: {
  	display: "inline",
  	color: theme.palette.text.secondary,
  	marginLeft: "1rem",
  },
  summaryTableContainer: {
  	maxWidth: "30rem",
  	margin: "5px auto 0",
  	display: "flex",
  	flex: "1 1 auto"
  },
  summaryTable: {
  	margin: "0 auto",
  },
  profileContent: {
  	padding: "0",
  	paddingBottom: "0px !important",
  },
  button: {
    color: "#0066ff",
    fontSize: 11,
    padding: 2,
    textAlign: "left",
    justifyContent: "initial",
    minHeight: 16,
    position: "static",
    "&:hover": {
        color: theme.palette.primary.main,
    }
  },
  buttonLabel: {
	textTransform: 'capitalize',
  },
});

function profileTable(props) {
	let { classes, data } = props;
	const labels = Object.keys(data);
	return (
		<Table className={classes.profileTable}>
			<TableHead><TableRow className={classes.profileTableRow}>{labels.map(value => <TableCell className={classes.profileTableCell}>{value}</TableCell>)}</TableRow></TableHead>
			<TableBody><TableRow className={classes.profileTableRow}>{labels.map(value => <TableCell className={classes.profileTableCell}>{data[value]}</TableCell>)}</TableRow></TableBody>
		</Table>
	);
}

function getHeaderContent(props) {
	let { classes, heading, type, image, image_caption, details, accordion, cards, summary_table } = props;
	let content = [];
	let subcontent = [];
	switch(type) {
		case "cards":
			content = cards.map((card, index) => <CustomCard key={index} index={index} {...card}/>);
			break;
		default:
			if (heading !== undefined && heading !== null) {
				let primaryHeading = heading;
				let secondaryHeading = null;
				if (heading instanceof Object) {
					primaryHeading = heading.primary;
					if (heading.secondary !== undefined) {
						if (heading.secondary instanceof Array) {
							secondaryHeading = [];
							for (let i = 0; i < heading.secondary.length; i++)  {
								let d = heading.secondary[i];
								let d_props = d.props || {};
								d_props.variant = d_props.variant || "caption";
								secondaryHeading.push(<Typography key={i} className={classes.headingDetails} {...d.props}>{d.label}</Typography>);
							}
							secondaryHeading = <div className={classes.headingDetailsContainer}>{secondaryHeading}</div>;
						} else {
							secondaryHeading = <Typography className={classes.headingDetails} variant="caption">{heading.secondary}</Typography>;
						}
					}
				}
				content.push(<div key="profileHeading" className={classes.headingContainer}><Typography className={classes.heading} variant="headline">{primaryHeading}</Typography>{secondaryHeading}</div>);
			}
			if (cards !== undefined && cards !== null) {
				content = content.concat(cards.map((card, index) => <CustomCard key={index} {...card}/>));
			}
			if (image !== undefined && image !== null) {
				let cardMedia = <CardMedia key="profileMedia" className={classes.image} image={image} title={heading || "image"}/>;
				if (image_caption !== undefined) {
					let cardContent = (
						<CardContent className={classes.profileContent}>
							<Typography variant="subheading" style={{"textAlign": "center"}}>{Object.keys(image_caption).map(value => image_caption[value]).join(" / ")}</Typography>
						</CardContent>
					);
					subcontent.push(<Card key="profileImage" className={classes.cardMedia}>{cardMedia}{cardContent}</Card>);
				} else {
					subcontent.push(cardMedia);
				}
			}
			if (details !== undefined && details !== null) {
				const increment = 4;
				let count = Math.ceil(details.length / increment)
				console.log(details);
				for (let i = 0; i < count; i++) {
					let items = details.slice(i * increment, (i + 1) * increment)
					subcontent.push(<SimpleList key={i} items={items} list_styles={classes.detailList} styles={classes.detailItem} secondary_styles={classes.detailItemLabel}/>);
				}
			}
			if (summary_table !== undefined && summary_table !== null) {
				subcontent.push(<div key="summaryTable" className={classes.summaryTableContainer}><div className={classes.summaryTable}><SummaryTable data={summary_table}/></div></div>);
			}
			if (accordion !== undefined && accordion !== null) {
				subcontent.push(<div key="profileAccordion" className={classes.accordionContainer}><Accordion classes={{root: classes.accordion}} expands={accordion}/></div>);
			}
			content.push(<Card key="profileCard" className={classes.card}>{subcontent}</Card>);
	}
	return content;
}

class ProfileHeader extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root} elevation={2}>
				{getHeaderContent(this.props)}
			</Paper>
		);
	}
}

export default withStyles(styles)(ProfileHeader);
