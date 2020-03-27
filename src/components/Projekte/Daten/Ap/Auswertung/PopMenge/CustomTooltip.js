import React from 'react'
import styled from 'styled-components'
import sortBy from 'lodash/sortBy'

import exists from '../../../../../../modules/exists'

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
  color: black;
`
const Label = styled.div`
  padding-right: 5px;
`
const Value = styled.div``

const CustomTooltip = ({ payload, label, active, popsData }) => {
  const payloadSorted = sortBy(payload, p => {
    const pop = popsData.find(d => d.id === p.dataKey)
    if (pop) return pop.nr
    return p.dataKey
  })
  return (
    <Popup>
      <Title>{label}</Title>
      {payloadSorted.map((p, i) => {
        const pop = popsData.find(d => d.id === p.dataKey)
        let label = p.dataKey
        if (pop) {
          label = `${pop.nr || '(keine Nr)'}: ${pop.name || '(kein Name)'}`
        }
        const value =
          exists(p.value) && p.value.toLocaleString
            ? p.value.toLocaleString('de-ch')
            : null
        return (
          <Row key={p.dataKey}>
            <Label>{`${label}:`}</Label>
            <Value>{value}</Value>
          </Row>
        )
      })}
    </Popup>
  )
}

export default CustomTooltip
