import React from 'react';
import getStore from '../../utils/honestyStore.js';
import StoreList from './StoreList';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

export class StoreListContainer extends React.Component {
	render() {
		return (
			<StoreList
				storeList={this.props.storeList}
				sendSlackMessageError={this.props.sendSlackMessageError}
			/>
		);
	}
}

StoreListContainer.propTypes = {
	username: PropTypes.string.isRequired
};

const mapStateToProps = state => {
	return {
		storeList: state.storeList,
		sendSlackMessageError: state.sendSlackMessageError
	};
};

function getStoreList() {
	return dispatch => {
		getStore((err, items) => {
			if (err) return;
			let storeList = items.map(item => ({
				name: item.name + (item.qualifier ? ' ' + item.qualifier : ''),
				index: item.id
			}));
			dispatch({
				type: 'SET_STORELIST',
				store: storeList
			});
		});
	};
}
const mapDispatchToProps = dispatch => {
	return {
		getStoreList
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StoreListContainer);
