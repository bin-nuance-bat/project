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
				handleClick={(id, name) => {
					props.setActualItem(id);
					props.history.push('/slackname');
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
