const labelFromValue = {
  0: 'n.b.',
  1: 'nicht',
  2: 'wenig',
  3: 'mässig',
  4: 'gut',
  5: 'sehr',
}

interface CustomTickProps {
  payload?: {
    value?: number
  }
  x?: number
  y?: number
  textAnchor?: 'inherit' | 'end' | 'start' | 'middle'
  stroke?: string
  radius?: number
}

export const CustomTick = ({
  payload,
  x,
  y,
  textAnchor,
  stroke,
  radius,
}: CustomTickProps) => {
  return (
    <g className="recharts-layer recharts-polar-angle-axis-tick">
      <text
        radius={radius}
        stroke={stroke}
        x={x}
        y={y}
        className="recharts-text recharts-polar-angle-axis-tick-value"
        textAnchor={textAnchor}
      >
        <tspan
          x={x}
          dy="0.3em"
        >
          {labelFromValue[payload?.value as keyof typeof labelFromValue]}
        </tspan>
      </text>
    </g>
  )
}
