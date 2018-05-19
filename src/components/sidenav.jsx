import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class SideNav extends React.Component {
  render() {
    const { classes, open, toggle } = this.props;

    const sideList = (
      <div className={classes.list}>
      </div>
    );

    return (
        <Drawer open={open} onClose={toggle}>
          <div
            tabIndex={0}
            role="button"
            onClick={toggle}
            onKeyDown={toggle}
          >
            {sideList}
          </div>
        </Drawer>
    );
  }
}

SideNav.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideNav);