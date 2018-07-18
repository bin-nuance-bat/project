import React from 'react';

const Input = props => {
	if (!props.hide)
		return (
			<div className="formGroup">
				<label>
					{props.label}:<br />
					<input
						type={props.type ? props.type : 'text'}
						value={props.value}
						onChange={e => props.setState(e.target.value)}
					/>
				</label>
			</div>
		);
	return null;
};

export default Input;
