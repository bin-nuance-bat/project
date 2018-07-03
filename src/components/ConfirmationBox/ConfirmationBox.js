import React from "react";

const ConfirmationBox = props => {
  return (
    <div>
      <div>{props.text}</div>
      <div>
        <button onClick={props.ifYes}>Yes</button>
        <button onClick={props.ifNo}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationBox;
