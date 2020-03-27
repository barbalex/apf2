import React from 'react'
import styled from 'styled-components'

import exists from '../../../../../modules/exists'

const Popup = styled.div`
  background-color: white;
  border: 1px solid #2e7d32;
  opacity: 0.8;
  padding: 8px;
`
const Title = styled.div`
  font-size: 1em;
  font-weight: 900;
`
const Row = styled.div`
  font-size: 0.8em;
  font-weight: 600;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  color: ${props => props.color};
`
const Label = styled.div`
  padding-right: 5px;
`
const Value = styled.div``

const CustomTooltip = ({ payload, label, active, color, reverse }) => {
  const data = reverse ? payload : payload.reverse()

  return (
    <Popup>
      <Title>{label}</Title>
      {data.map((o, i) => {
        const value =
          exists(o.value) && o.value.toLocaleString
            ? o.value.toLocaleString('de-ch')
            : null

        return (
          <Row key={o.dataKey} color={color[o.dataKey]}>
            <Label>{`${o.dataKey}:`}</Label>
            <Value>{value}</Value>
          </Row>
        )
      })}
    </Popup>
  )
}

export default CustomTooltip
