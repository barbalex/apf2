import React from 'react'
import styled from 'styled-components'

const CheckboxContainer = styled.div`
  width: 100%;
  height: 100%;
`

const Icon = styled.svg`
  fill: none;
  stroke: #2e7d32;
  stroke-width: 3px;
`
const StyledCheckbox = styled.div`
  position: relative;
  width: 19px;
  height: 19px;
  background: ${props => (props.planned ? 'rgba(46, 125, 50, 0.05)' : 'none')};
  border-radius: 3px;
  border: ${props => (props.planned ? '1px solid #2e7d32' : 'none')};
  transition: all 150ms;
  margin-left: auto;
  margin-right: auto;
`
const NrOfEk = styled.div`
  font-weight: 900;
  font-size: smaller;
  position: absolute;
  bottom: -2px;
  right: 0;
  color: red;
`

const EkIcon = ({ planned, done }) => {
  if (!planned && !done) return <CheckboxContainer>&nbsp;</CheckboxContainer>
  return (
    <CheckboxContainer>
      <StyledCheckbox planned={planned}>
        {!!done && (
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        )}
        {done > 1 && <NrOfEk>{done}</NrOfEk>}
      </StyledCheckbox>
    </CheckboxContainer>
  )
}

export default EkIcon
