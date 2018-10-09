import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ProfileHeader from '../components/profileHeader'
import ProfileTabs from '../components/profileTabs'
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { getImage } from '../utils/url';

const styles = theme => ({
	root: {
		position: "relative",
	},
	selectRoot: {
		fontSize: ".8rem",
	},
	selectInput: {
		padding: ".2rem 0 .2rem",
		paddingRight: "2rem",
    display: "flex"
	},
  selectItem: {
    padding: ".5rem"
  },
  selectAvatar: {
    width: "1.5rem",
    height: "1.5rem",
  }
});

class QuickMenu extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render() {
    let { classes, label, options, value } = this.props;

    return (
      <FormControl style={{position: "absolute", right:0, top: 0}}>
      	<InputLabel style={{fontSize: ".7rem"}}>{label}</InputLabel>
      	<Select
            value={value || options[0].label}
            onChange={this.handleChange}
            classes={{root: classes.selectRoot, select: classes.selectInput}}
            style={{marginTop: ".5rem"}}
        >
          {options.map((value, i) => {
            let avatar = null;
            if (value.image !== undefined) {
              avatar = <Avatar alt={value.label} src={getImage(value.image)} className={classes.selectAvatar}/>
            }
            return <MenuItem className={classes.selectItem} component="a" href={value.href} key={i} value={value.label}>{avatar}<ListItemText>{value.label}</ListItemText></MenuItem>;
          })}
        </Select>
      </FormControl>
    );
  }
}

class Profile extends React.Component {
	render() {
		const { classes, header, tabs, quick_menu } = this.props;
		const menu = (quick_menu !== undefined) ? <QuickMenu classes={classes} {...quick_menu}/> : null;
		return (
			<div className={classes.root}>
				{menu}
				<ProfileHeader {...header}></ProfileHeader>
				<ProfileTabs tabs={tabs}></ProfileTabs>
			</div>
		)
	}
}

export default withStyles(styles)(Profile);