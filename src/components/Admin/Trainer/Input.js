import React from 'react';

const Input = props => {
	if (!props.hide) {
		let inputProps = {};
		if (props.range) {
			inputProps.min = props.range[0];
			inputProps.max = props.range[1];
		}
		return (
			<div className="formGroup">
				<label>
					{props.label}:<br />
					<input
						type={props.type ? props.type : 'number'}
						value={props.value}
						{...inputProps}
						onChange={e => props.setState(e.target.value)}
					/>
				</label>
			</div>
		);
	}
	return null;
};

export default Input;
