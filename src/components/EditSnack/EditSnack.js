import React from 'react';
import PropTypes from 'prop-types';
import ButtonList from '../ButtonList/ButtonList';
import Logo from '../Logo/Logo';

const EditSnack = props => {
	return (
		<div>
			<Logo />
			<ButtonList
				items={props.items}
				onClick={(id, name) => {
					props.setActualItem(name);
				}}
			/>
		</div>
	);
};

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
