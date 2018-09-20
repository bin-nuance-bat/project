import React from 'react';
import PropTypes from 'prop-types';

const SIZE = 768;
const BORDER_WIDTH = 72;
const BORDER_CENTER = BORDER_WIDTH / 2;
const HUD_INITIAL_LENGTH = 64;
const HUD_STROKE_WIDTH = 8;

const ViewFinder = props => {
  const hudLength = Math.min(
    HUD_INITIAL_LENGTH +
      props.animation * (SIZE / 2 - BORDER_WIDTH - HUD_INITIAL_LENGTH),
    SIZE / 2 - BORDER_WIDTH
  );

  const color = hudLength === SIZE / 2 - BORDER_WIDTH ? '#47BED8' : '#ffffff';

  return (
    <svg viewBox={[0, 0, SIZE, SIZE]} id="view-finder">
      <polyline
        fill="none"
        stroke="#000000"
        opacity="0.5"
        strokeLinecap="square"
        strokeWidth={BORDER_WIDTH}
        points={[
          BORDER_CENTER,
          BORDER_CENTER,
          SIZE - BORDER_CENTER,
          BORDER_CENTER,
          SIZE - BORDER_CENTER,
          SIZE - BORDER_CENTER,
          BORDER_CENTER,
          SIZE - BORDER_CENTER,
          BORDER_CENTER,
          BORDER_CENTER
        ]}
      />

      <circle
        cx={BORDER_WIDTH}
        cy={BORDER_WIDTH}
        r={HUD_STROKE_WIDTH / 2}
        fill={color}
      />
      <line
        x1={BORDER_WIDTH}
        y1={BORDER_WIDTH}
        x2={BORDER_WIDTH}
        y2={BORDER_WIDTH + hudLength}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />
      <line
        x1={BORDER_WIDTH}
        y1={BORDER_WIDTH}
        x2={BORDER_WIDTH + hudLength}
        y2={BORDER_WIDTH}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />

      <circle
        cx={BORDER_WIDTH}
        cy={SIZE - BORDER_WIDTH}
        r={HUD_STROKE_WIDTH / 2}
        fill={color}
      />
      <line
        x1={BORDER_WIDTH}
        y1={SIZE - BORDER_WIDTH - hudLength}
        x2={BORDER_WIDTH}
        y2={SIZE - BORDER_WIDTH}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />
      <line
        x1={BORDER_WIDTH}
        y1={SIZE - BORDER_WIDTH}
        x2={BORDER_WIDTH + hudLength}
        y2={SIZE - BORDER_WIDTH}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />

      <circle
        cx={SIZE - BORDER_WIDTH}
        cy={BORDER_WIDTH}
        r={HUD_STROKE_WIDTH / 2}
        fill={color}
      />
      <line
        x1={SIZE - BORDER_WIDTH - hudLength}
        y1={BORDER_WIDTH}
        x2={SIZE - BORDER_WIDTH}
        y2={BORDER_WIDTH}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />
      <line
        x1={SIZE - BORDER_WIDTH}
        y1={BORDER_WIDTH}
        x2={SIZE - BORDER_WIDTH}
        y2={BORDER_WIDTH + hudLength}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />

      <circle
        cx={SIZE - BORDER_WIDTH}
        cy={SIZE - BORDER_WIDTH}
        r={HUD_STROKE_WIDTH / 2}
        fill={color}
      />
      <line
        x1={SIZE - BORDER_WIDTH - hudLength}
        y1={SIZE - BORDER_WIDTH}
        x2={SIZE - BORDER_WIDTH}
        y2={SIZE - BORDER_WIDTH}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />
      <line
        x1={SIZE - BORDER_WIDTH}
        y1={SIZE - BORDER_WIDTH}
        x2={SIZE - BORDER_WIDTH}
        y2={SIZE - BORDER_WIDTH - hudLength}
        stroke={color}
        strokeWidth={HUD_STROKE_WIDTH}
      />
    </svg>
  );
};

ViewFinder.propTypes = {
  animation: PropTypes.number.isRequired
};

export default ViewFinder;
