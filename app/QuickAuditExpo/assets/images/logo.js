import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

const Logo = ({ width = 100, height = 100 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      {/* Main circle */}
      <Circle cx="100" cy="100" r="90" fill="#3333FF" />
      
      {/* Inner circle (accent color) */}
      <Circle cx="100" cy="100" r="70" fill="#FFFFFF" />
      
      {/* Checkmark */}
      <G transform="translate(60, 100) scale(0.8)">
        <Path
          d="M10,50 L40,80 L90,30"
          stroke="#00C853"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
      
      {/* "Q" letter stylized as magnifying glass */}
      <Circle cx="100" cy="90" r="35" stroke="#3333FF" strokeWidth="10" fill="none" />
      <Path
        d="M125,115 L145,135"
        stroke="#3333FF"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Logo;
