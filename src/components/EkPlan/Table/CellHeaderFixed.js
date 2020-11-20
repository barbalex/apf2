import React from 'react'
import styled from 'styled-components'

const StyledYearHeaderCell = styled.div`
  text-align: left;
  font-weight: 500;
  font-size: 0.75rem;
  color: black;
  line-height: 60px;
  border-left: solid hsla(120, 25%, 70%, 1) 1px;
  border-right: solid hsla(120, 25%, 70%, 1) 1px;
  border-bottom: solid #e6e6e6 1px;
  background: hsla(120, 25%, 88%, 1);
  user-select: none;
  span {
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    padding: 2px 4px;
  }
  &.column-hovered {
    background: hsla(120, 25%, 82%, 1) !important;
    font-weight: 800 !important;
  }
  &:first-child span {
    padding-left: 10px;
  }
`

const CellHeaderFixed = ({ style, column }) => {
  const { label } = column

  return (
    <StyledYearHeaderCell style={style}>
      <span>{label}</span>
    </StyledYearHeaderCell>
  )
}

export default CellHeaderFixed
