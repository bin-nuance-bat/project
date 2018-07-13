import React from 'react';
import Logo from '../Logo/Logo';
import {Glyphicon} from 'react-bootstrap';
import './Disclaimer.css';

const Disclaimer = props => {
	return (
		<div>
			<div id="header">
				<button id="backButton" onClick={() => props.history.push('/')}>
					<Glyphicon glyph="chevron-left" />
				</button>
				<Logo />
			</div>
			<div>
				<Glyphicon id="bigCameraIcon" glyph="camera" />
			</div>
			<div className="infoText">
				As part of this process we will use the tablet's front-facing
				camera to attempt to identify your snack.
			</div>
			<div>
				<Glyphicon id="lockIcon" glyph="lock" />
			</div>
			<div className="infoText">
				Images may be stored in order to increase the accuracy of the
				item recognition, but they will not be used for any other
				purpose or shared with any third parties.
			</div>
			<button
				id="acceptButton"
				onClick={() => props.history.push('/scanitem')}>
				Accept and continue
			</button>
		</div>
	);
};

export default Disclaimer;
