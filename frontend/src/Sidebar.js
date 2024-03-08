import React, {component, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export default Sidebar = () => {

  return(
    <div>
      <Sidebar>
        <Menu>
          <SubMenu label="Charts">
            <MenuItem> Pie charts </MenuItem>
            <MenuItem> Line charts </MenuItem>
          </SubMenu>
          <MenuItem> Documentation </MenuItem>
          <MenuItem> Calendar </MenuItem>
        </Menu>
      </Sidebar>;
    </div>

  );
}

