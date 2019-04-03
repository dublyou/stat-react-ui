import React from 'react';
import Drawer from '@material-ui/core/Drawer';

class SideNav extends React.Component {
  render() {
    const { open, toggle, children } = this.props;

    return (
        <Drawer open={open} onClose={toggle}>
          {children}
        </Drawer>
    );
  }
}

export default SideNav;