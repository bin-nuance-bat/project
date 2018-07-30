import React from 'react';
import PropTypes from 'prop-types';

const Bubble = props => {
  return (
    <div>
      <svg
        width="121px"
        height="112px"
        viewBox="0 0 121 112"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd">
          <g
            id="Artboard-Copy-4"
            transform="translate(-612.000000, -241.000000)"
            fill="#47BED8">
            <g id="Bubble" transform="translate(612.000000, 241.000000)">
              <circle id="Oval-3" cx="56" cy="56" r="56" />
              <polygon
                id="Triangle"
                transform="translate(108.290129, 85.211414) rotate(122.000000) translate(-108.290129, -85.211414) "
                points="108.290129 70.7114138 126.290129 99.7114138 90.2901291 99.7114138"
              />
            </g>
          </g>
        </g>
        <text fill="#FFFFFF" transform="translate(20, 85) scale(5)">
          {props.letter}
        </text>
      </svg>
    </div>
  );
};

Bubble.propTypes = {
  letter: PropTypes.string.isRequired
};

export default Bubble;
