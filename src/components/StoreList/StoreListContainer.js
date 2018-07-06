import React from 'react';
import getStore from '../../utils/honestyStore.js';
import StoreList from './StoreList';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

export class StoreListContainer extends React.Component {
	componentDidMount() {
		console.log(this.props);
	}

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

const mapDispatchToProps = dispatch => {
	return {
		getStoreList: getStore()
			.then(items => {
				items.map(item => ({
					name:
						item.name +
						(item.qualifier ? ' ' + item.qualifier : ''),
					index: item.id
				}));
			})
			.then(storeList => {
				dispatch({
					type: 'SET_STORELIST',
					store: storeList
				});
			})
			.catch(err => console.log(err))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(StoreListContainer);
