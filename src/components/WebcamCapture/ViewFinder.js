import React from 'react';
import PropTypes from 'prop-types';

const ViewFinder = props => {
  const sw = 72;
  const w = 768;
  const vfw = 8;
  const vfl = Math.min(64 + props.animation * (w / 2 - sw - 64), w / 2 - sw);
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

      <circle cx={sw} cy={sw} r={vfw / 2} fill={color} />
      <line
        x1={sw}
        y1={sw}
        x2={sw}
        y2={sw + vfl}
        stroke={color}
        strokeWidth={vfw}
      />
      <line
        x1={sw}
        y1={sw}
        x2={sw + vfl}
        y2={sw}
        stroke={color}
        strokeWidth={vfw}
      />

      <circle cx={sw} cy={w - sw} r={vfw / 2} fill={color} />
      <line
        x1={sw}
        y1={w - sw - vfl}
        x2={sw}
        y2={w - sw}
        stroke={color}
        strokeWidth={vfw}
      />
      <line
        x1={sw}
        y1={w - sw}
        x2={sw + vfl}
        y2={w - sw}
        stroke={color}
        strokeWidth={vfw}
      />

      <circle cx={w - sw} cy={sw} r={vfw / 2} fill={color} />
      <line
        x1={w - sw - vfl}
        y1={sw}
        x2={w - sw}
        y2={sw}
        stroke={color}
        strokeWidth={vfw}
      />
      <line
        x1={w - sw}
        y1={sw}
        x2={w - sw}
        y2={sw + vfl}
        stroke={color}
        strokeWidth={vfw}
      />

      <circle cx={w - sw} cy={w - sw} r={vfw / 2} fill={color} />
      <line
        x1={w - sw - vfl}
        y1={w - sw}
        x2={w - sw}
        y2={w - sw}
        stroke={color}
        strokeWidth={vfw}
      />
      <line
        x1={w - sw}
        y1={w - sw}
        x2={w - sw}
        y2={w - sw - vfl}
        stroke={color}
        strokeWidth={vfw}
      />
    </svg>
  );
};

ViewFinder.propTypes = {
  animation: PropTypes.number.isRequired
};

export default ViewFinder;
