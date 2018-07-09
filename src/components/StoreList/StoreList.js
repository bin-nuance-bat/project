import React from 'react';
import ButtonList from '../ButtonList/ButtonList';
import {sendSlackMessage, getUserSlackID} from '../../utils/slack';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import PropTypes from 'prop-types';

class StoreList extends React.Component {
	componentDidMount() {
		this.props.getStoreList();
	}

	render() {
		return (
			<div>
				<ButtonList
					items={this.props.storeList}
					onClick={(storeCode, itemName) => {
						let id = getUserSlackID(
							this.props.currentUser,
							this.props.users
						);
						sendSlackMessage(id, itemName, storeCode);
						this.props.setShowList(false);
					}}
				/>
				{this.props.loadStoreListError && (
					<ErrorMessage text="failed to load store items" />
				)}
			</div>
		);
	}
}

StoreList.propTypes = {
	getStoreList: PropTypes.func.isRequired,
	setShowList: PropTypes.func.isRequired,
	loadStoreListError: PropTypes.func.isRequired,
	currentUser: PropTypes.string,
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	storeList: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default StoreList;
