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
`
const Span = styled.span`
  padding: 1px 4px;
`

export const LoadingButtonFittingText = memo(
  ({ width, height, onClick, loading, text }) => {
    const ref = useRef()
    useLayoutEffect(() => {
      textFit(ref.current, {
        // multiLine: true,
        alignVert: true,
        alignHoriz: true,
      })
    }, [])

    return (
      <StyledLoadingButton
        variant="outlined"
        style={{ width, height }}
        onClick={onClick}
        loading={loading}
        ref={ref}
      >
        <Span>{text}</Span>
      </StyledLoadingButton>
    )
  },
)
