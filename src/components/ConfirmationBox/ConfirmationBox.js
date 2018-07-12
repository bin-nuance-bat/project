import React from 'react';

class ConfirmationBox extends React.Component {
	handleYes = () => {
		this.props.setActualItem(
			this.props.storeList[this.props.prediction.id].name
		);
		this.props.history.push('/slackname');
	};

	handleNo = () => {
		this.props.history.push('/editSnack');
	};

	render() {
		return (
			<div>
				<div>{`Did you take ${
					this.props.storeList[this.props.prediction.id].name
				}?`}</div>
				<img src={this.props.prediction.img} alt="" />
				<div>
					<button testattribute="YES" onClick={this.handleYes}>
						Yes
					</button>
					<button testattribute="NO" onClick={this.handleNo}>
						No
					</button>
				</div>
			</div>
		);
	}
}

export default ConfirmationBox;
