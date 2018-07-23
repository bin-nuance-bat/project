import React from 'react';
import Logo from '../Logo/Logo';
import './Disclaimer.css';

const Disclaimer = props => {
	return (
		<div>
			<div>
				<button
					className="button button-back"
					onClick={() => props.history.push('/')}>
					<svg width="59" height="61" viewBox="0 0 59 61">
						<g fill="none" fillRule="evenodd">
							<polygon points="0 0 59 0 59 59 0 59" />
							<polygon
								fill="#FFF"
								fillRule="nonzero"
								points="44 10.38 39.602 6 15 30.5 39.602 55 44 50.62 23.797 30.5"
							/>
						</g>
					</svg>
				</button>
				<Logo />
			</div>
			<div>
				<svg
					className="bigcamera"
					width="75"
					height="74"
					viewBox="0 0 75 74">
					<g fill="none" fillRule="evenodd">
						<circle
							cx="37.5"
							cy="37.5"
							r="9.643"
							fill="#FFF"
							fillRule="nonzero"
						/>
						<path
							fill="#FFF"
							fillRule="nonzero"
							d="M28.1785714,6.42857143 L22.4925,12.6190476 L12.6428571,12.6190476 C9.225,12.6190476 6.42857143,15.4047619 6.42857143,18.8095238 L6.42857143,55.952381 C6.42857143,59.3571429 9.225,62.1428571 12.6428571,62.1428571 L62.3571429,62.1428571 C65.775,62.1428571 68.5714286,59.3571429 68.5714286,55.952381 L68.5714286,18.8095238 C68.5714286,15.4047619 65.775,12.6190476 62.3571429,12.6190476 L52.5075,12.6190476 L46.8214286,6.42857143 L28.1785714,6.42857143 Z M37.5,52.8571429 C28.9242857,52.8571429 21.9642857,45.9238095 21.9642857,37.3809524 C21.9642857,28.8380952 28.9242857,21.9047619 37.5,21.9047619 C46.0757143,21.9047619 53.0357143,28.8380952 53.0357143,37.3809524 C53.0357143,45.9238095 46.0757143,52.8571429 37.5,52.8571429 Z"
						/>
						<polygon points="0 0 75 0 75 75 0 75" />
					</g>
				</svg>
			</div>
			<div className="text text-info">
				As part of this process we will use the tablet&#39;s
				front-facing camera to attempt to identify your snack.
			</div>
			<div>
				<svg
					className="lock"
					width="75"
					height="74"
					viewBox="0 0 75 74">
					<g fill="none" fillRule="evenodd">
						<polygon points="0 0 75 0 75 75 0 75" />
						<path
							fill="#FFF"
							fillRule="nonzero"
							d="M56.25,25 L53.125,25 L53.125,18.75 C53.125,10.125 46.125,3.125 37.5,3.125 C28.875,3.125 21.875,10.125 21.875,18.75 L21.875,25 L18.75,25 C15.3125,25 12.5,27.8125 12.5,31.25 L12.5,62.5 C12.5,65.9375 15.3125,68.75 18.75,68.75 L56.25,68.75 C59.6875,68.75 62.5,65.9375 62.5,62.5 L62.5,31.25 C62.5,27.8125 59.6875,25 56.25,25 Z M37.5,53.125 C34.0625,53.125 31.25,50.3125 31.25,46.875 C31.25,43.4375 34.0625,40.625 37.5,40.625 C40.9375,40.625 43.75,43.4375 43.75,46.875 C43.75,50.3125 40.9375,53.125 37.5,53.125 Z M47.1875,25 L27.8125,25 L27.8125,18.75 C27.8125,13.40625 32.15625,9.0625 37.5,9.0625 C42.84375,9.0625 47.1875,13.40625 47.1875,18.75 L47.1875,25 Z"
						/>
					</g>
				</svg>{' '}
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
