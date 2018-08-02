import React from 'react';
import PropTypes from 'prop-types';

const SIZE = 768;
const BORDER_WIDTH = 72;
const HUD_INITIAL_LENGTH = 64;
const HUD_STROKE_WIDTH = 8;

const ViewFinder = props => {
  const bw = BORDER_WIDTH;
  const bc = BORDER_WIDTH / 2;
  const s = SIZE;
  const hw = HUD_STROKE_WIDTH;
  const hl = Math.min(
    HUD_INITIAL_LENGTH + props.animation * (s / 2 - bw - HUD_INITIAL_LENGTH),
    s / 2 - bw
  );

  const color = hl === s / 2 - bw ? '#47BED8' : '#ffffff';

  return (
    <svg viewBox={[0, 0, s, s]} id="view-finder">
      <polyline
        fill="none"
        stroke="#000000"
        opacity="0.5"
        strokeWidth={bw}
        points={[bc, bc, s - bc, bc, s - bc, s - bc, bc, s - bc, bc, bc]}
      />

      <circle cx={bw} cy={bw} r={hw / 2} fill={color} />
      <line
        x1={bw}
        y1={bw}
        x2={bw}
        y2={bw + hl}
        stroke={color}
        strokeWidth={hw}
      />
      <line
        x1={bw}
        y1={bw}
        x2={bw + hl}
        y2={bw}
        stroke={color}
        strokeWidth={hw}
      />

      <circle cx={bw} cy={s - bw} r={hw / 2} fill={color} />
      <line
        x1={bw}
        y1={s - bw - hl}
        x2={bw}
        y2={s - bw}
        stroke={color}
        strokeWidth={hw}
      />
      <line
        x1={bw}
        y1={s - bw}
        x2={bw + hl}
        y2={s - bw}
        stroke={color}
        strokeWidth={hw}
      />

      <circle cx={s - bw} cy={bw} r={hw / 2} fill={color} />
      <line
        x1={s - bw - hl}
        y1={bw}
        x2={s - bw}
        y2={bw}
        stroke={color}
        strokeWidth={hw}
      />
      <line
        x1={s - bw}
        y1={bw}
        x2={s - bw}
        y2={bw + hl}
        stroke={color}
        strokeWidth={hw}
      />

      <circle cx={s - bw} cy={s - bw} r={hw / 2} fill={color} />
      <line
        x1={s - bw - hl}
        y1={s - bw}
        x2={s - bw}
        y2={s - bw}
        stroke={color}
        strokeWidth={hw}
      />
      <line
        x1={s - bw}
        y1={s - bw}
        x2={s - bw}
        y2={s - bw - hl}
        stroke={color}
        strokeWidth={hw}
      />
    </svg>
  );
};

ViewFinder.propTypes = {
  animation: PropTypes.number.isRequired
};

export default ViewFinder;
