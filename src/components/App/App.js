import React from 'react';
import './App.css';
import Logo from '../Logo/Logo';
import {Glyphicon} from 'react-bootstrap';

class App extends React.Component {
	componentDidMount() {
		this.props.loadStoreList();
	}

	render() {
		const {setSendWithPhoto, history} = this.props;
		const scanItem = (withPhoto = false) => {
			setSendWithPhoto(withPhoto);
			history.push('/disclaimer');
		};
		return (
			<div>
				<Logo />
				<div className="page-home">
					<h2 className="text text-payinglater">Paying later?</h2>
					<div className="text text-subheading">
						Why not send yourself a reminder on Slack?
					</div>
					<button
						className="button button-snackchat"
						onClick={() => {
							scanItem(true)
						}}>

						Send a SnackChat
						<Glyphicon
							className="cameraicon-small"
							glyph="camera"
						/>
					</button>
					<button className="buttonWhite" onClick={() => scanItem()}>

					<button
						className="button button-nophoto"
						onClick={() => {() => scanItem();
						}}>
						Send a reminder without a photo
					</button>
				</div>
			</div>
		);
	}
}

export default App;
