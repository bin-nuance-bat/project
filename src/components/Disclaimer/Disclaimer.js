import React from 'react';
import Logo from '../Logo/Logo';
import {Glyphicon} from 'react-bootstrap';
import './Disclaimer.css';

const Disclaimer = props => {
	return (
		<div>
			<div>
				<button
					className="button button-back"
					onClick={() => props.history.push('/')}>
					<Glyphicon glyph="chevron-left" />
				</button>
				<Logo />
			</div>
			<div>
				<Glyphicon className="cameraicon-big" glyph="camera" />
			</div>
			<div className="text text-info">
				As part of this process we will use the tablet&#39;s
				front-facing camera to attempt to identify your snack.
			</div>
			<div>
				<Glyphicon className="lockicon" glyph="lock" />
			</div>
			<div className="text text-info">
				Images may be stored in order to increase the accuracy of the
				item recognition, but they will not be used for any other
				purpose or shared with any third parties.
			</div>
			<button
				className="button button-accept"
				onClick={() => props.history.push('/scanitem')}>
				Accept and continue
			</button>
		</div>
	);
};

export default Disclaimer;
