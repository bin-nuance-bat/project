import React from 'react';
import PropTypes from 'prop-types';
import ButtonList from '../ButtonList/ButtonList';
import Logo from '../Logo/Logo';

const EditSnack = props => {
	return (
		<ButtonList
			items={props.items}
			onClick={(id, name) => {
				props.setActualItem(id);
				props.history.push('/slackname');
			}}
		/>
	);
};

EditSnack.propTypes = {
	setActualItem: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default EditSnack;
