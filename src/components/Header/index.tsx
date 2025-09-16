import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  const navLinkStyle = {
    margin: '0 10px',
  };
  const activeStyle = {
    textDecoration: 'underline',
    color: 'red',
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
      <div>标题</div>
      <nav>
        <NavLink
          to="/create"
          style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
        >
          创建红包
        </NavLink>
        <NavLink
          to="/claim"
          style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
        >
          抢红包
        </NavLink>
      </nav>
      <div></div>
    </header>
  );
};

export default Header;
