import { memo, useLayoutEffect, useRef } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import styled from '@emotion/styled'
import textFit from 'textfit'

const StyledLoadingButton = styled(LoadingButton)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  color: white;
  border-color: white;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  resize: both;
  overflow: hidden;
`
const Span = styled.span`
  padding: 1px 4px;
`

export const LoadingButtonFittingText = memo(
  ({ width, height, onClick, loading, text }) => {
    return (
      <StyledLoadingButton
        variant="outlined"
        onClick={onClick}
        loading={loading}
        width={width}
        height={height}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 500 75"
          preserveAspectRatio="xMinYMid meet"
          // style={{ backgroundColor: 'green' }}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <text
            x="0"
            y="75"
            fontSize="30"
            fill="black"
          >
            {text}
          </text>
        </svg>
      </StyledLoadingButton>
    )
  },
)
