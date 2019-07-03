import React from "react";

const SvgEfk = props => (
  <svg width={24} height={24} {...props}>
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M12 6.5a9.77 9.77 0 0 1 8.82 5.5c-1.65 3.37-5.02 5.5-8.82 5.5S4.83 15.37 3.18 12A9.77 9.77 0 0 1 12 6.5m0-2C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5z" />
    <text
      transform="scale(1.1231 .89036)"
      x={4.197}
      y={21.912}
      fill="#f7f7f7"
      fontFamily="sans-serif"
      fontSize={22.57}
      letterSpacing={0}
      stroke="#000"
      strokeWidth={0.564}
      wordSpacing={0}
      style={{
        lineHeight: 1.25
      }}
    >
      <tspan x={4.197} y={21.912}>
        {"F"}
      </tspan>
    </text>
  </svg>
);

export default SvgEfk;
