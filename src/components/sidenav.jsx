import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

class SideNav extends React.Component {
  render() {
    const { classes, open, toggle, children } = this.props;

    return (
        <Drawer open={open} onClose={toggle}>
          {children}
        </Drawer>
    );
  }
}

export default SideNav;