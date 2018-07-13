import React from 'react';
import logo from './logo.svg';
import './Logo.css';
import {NavLink} from 'react-router-dom';

const Logo = () => (
	<div>
		<NavLink to="/">
			<img src={logo} className="logo" alt="" />
		</NavLink>
	</div>
);

export default Logo;
