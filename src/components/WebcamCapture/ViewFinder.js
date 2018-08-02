import React from 'react';
import PropTypes from 'prop-types';

const ViewFinder = props => {
  const sw = 72;
  const w = 768;
  const vfl = Math.min(64 + props.animation * (w / 2 - sw), w / 2 - sw);
  const color = vfl === w / 2 - sw ? '#47BED8' : '#ffffff';
  return (
    <svg viewBox={[0, 0, w, w]} id="view-finder">
      <polyline
        fill="none"
        stroke="#000000"
        opacity="0.5"
        strokeWidth={sw}
        points={[
          sw / 2,
          sw / 2,
          w - sw / 2,
          sw / 2,
          w - sw / 2,
          w - sw / 2,
          sw / 2,
          w - sw / 2,
          sw / 2,
          sw / 2
        ]}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="8"
        points={[sw, sw + vfl, sw, sw, sw + vfl, sw]}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="8"
        points={[sw, w - sw - vfl, sw, w - sw, sw + vfl, w - sw]}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="8"
        points={[w - sw - vfl, sw, w - sw, sw, w - sw, sw + vfl]}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="8"
        points={[w - sw - vfl, w - sw, w - sw, w - sw, w - sw, w - sw - vfl]}
      />
    </svg>
  );
};

ViewFinder.propTypes = {
  animation: PropTypes.number.isRequired
};

export default ViewFinder;
