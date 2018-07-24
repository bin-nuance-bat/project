import React from 'react';
import './App.css';
import Logo from '../Logo/Logo';
import HomeHandsSlot from './HomeHands/Slot.svg';
import HomeHandsRight from './HomeHands/Right.svg';
import HomeHandsCenter from './HomeHands/Center.svg';
import HomeHandsLeft from './HomeHands/Left.svg';

class App extends React.Component {
	componentDidMount() {
		this.props.loadStoreList();
	}

	handleSnackChatClick = () => {
		this.props.setSendWithPhoto(true);
		this.props.history.push('/disclaimer');
	};

	handleReminderNoPhotoClick = () => {
		this.props.setSendWithPhoto(false);
		this.props.history.push('/disclaimer');
	};

	render() {
		return (
			<div>
				<Logo />
				<div className="page-home">
					<h2 className="text text-payinglater">Paying later?</h2>
					<div className="text text-subheading">
						Why not send yourself a reminder on Slack?
					</div>
					<div className="home-hands">
						<img
							className="home-hands-slot"
							src={HomeHandsSlot}
							alt=""
						/>
						<img
							className="home-hands-right"
							src={HomeHandsRight}
							alt=""
						/>
						<img
							className="home-hands-center"
							src={HomeHandsCenter}
							alt=""
						/>
						<img
							className="home-hands-left"
							src={HomeHandsLeft}
							alt=""
						/>
					</div>
					<button
						className="button button-snackchat"
						onClick={this.handleSnackChatClick}>
						Send a SnackChat
						<svg
							className="smallcamera"
							width="28"
							height="28"
							viewBox="0 0 28 28">
							<g fill="none" fillRule="evenodd">
								<circle
									cx="14"
									cy="14"
									r="3.6"
									fill="#FFF"
									fillRule="nonzero"
								/>
								<path
									fill="#FFF"
									fillRule="nonzero"
									d="M10.5199994,2.39999986 L8.3971995,4.71111083 L4.71999972,4.71111083 C3.44399979,4.71111083 2.39999986,5.75111077 2.39999986,7.0222218 L2.39999986,20.8888876 C2.39999986,22.1599987 3.44399979,23.1999986 4.71999972,23.1999986 L23.2799986,23.1999986 C24.5559985,23.1999986 25.5999985,22.1599987 25.5999985,20.8888876 L25.5999985,7.0222218 C25.5999985,5.75111077 24.5559985,4.71111083 23.2799986,4.71111083 L19.6027988,4.71111083 L17.479999,2.39999986 L10.5199994,2.39999986 Z M13.9999992,19.7333322 C10.7983994,19.7333322 8.19999951,17.1448879 8.19999951,13.9555547 C8.19999951,10.7662216 10.7983994,8.17777729 13.9999992,8.17777729 C17.201599,8.17777729 19.7999988,10.7662216 19.7999988,13.9555547 C19.7999988,17.1448879 17.201599,19.7333322 13.9999992,19.7333322 Z"
								/>
								<polygon points="0 0 28 0 28 28 0 28" />
							</g>
						</svg>
					</button>
					<button
						className="button button-nophoto"
						onClick={this.handleReminderNoPhotoClick}>
						Send a reminder without a photo
					</button>
				</div>
			</div>
		);
	}
}

export default App;
