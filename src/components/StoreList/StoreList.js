import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import getStore from '../../utils/honestyStore.js';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import {connect} from 'react-redux';

class StoreList extends React.Component {
	componentDidMount() {
		this.props.setStore();
	}

	render() {
		return (
			<div>
				<ButtonList
					items={this.props.storeList}
					onClick={(storeCode, itemName) => {
						try {
							let id = getUserSlackID(
								this.props.currentUser,
								this.props.users
							);
							if (!id) throw new Error();
							sendSlackMessage(id, itemName, storeCode);
						} catch (error) {
							this.setState({sendSlackMessageError: true});
						}
					}}
				/>
				{this.props.sendSlackMessageError && (
					<ErrorMessage text={'failed to send Slack message'} />
				)}
			</div>
		);
	}
}

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
)(StoreList);
export {StoreList};
