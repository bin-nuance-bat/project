import {connect} from 'react-redux';
import React from 'react';
import {setActualItem} from '../ConfirmationBox/actions';
import ButtonList from '../ButtonList/ButtonList';

class EditSnack extends React.Component {
	render() {
		return (
			<ButtonList
				items={Object.values(this.props.storeList)}
				onClick={(id, name) => {
					this.props.setActualItem(name);
				}}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		storeList: state.storeList
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setActualItem: itemName => {
			dispatch(setActualItem(itemName));
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(EditSnack);
