import React from 'react'
import styled from '@emotion/styled'
import sortBy from 'lodash/sortBy'

import { exists } from '../../../../../modules/exists.js'

const Popup = styled.div`
  background-color: white;
  border: 1px solid #2e7d32;
  opacity: 0.8;
  padding: 8px;
`
const Title = styled.div`
  font-size: 1em;
  font-weight: 700;
`
const Row = styled.div`
  font-size: 0.8em;
  font-weight: 700;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  color: ${(props) => props.color};
`
const Label = styled.div`
  padding-right: 5px;
`
const Value = styled.div``
const colorUrspruenglich = '#2e7d32'
const colorAngesiedelt = 'rgba(245,141,66,1)'

export const CustomTooltip = ({ payload = [], label, active, tpopsData }) => {
  const payloadSorted = sortBy(payload, (p) => {
    const tpop = tpopsData.find((d) => d.id === p.dataKey)
    if (tpop) return tpop.nr
    return p.dataKey
  })

  return (
    <Popup>
      <Title>{label}</Title>
      {payloadSorted.map((p, i) => {
        const tpop = tpopsData.find((d) => d.id === p.dataKey)
        let label = p.dataKey
        if (tpop) {
          label = tpop.label
        }
        const value =
          exists(p.value) && p.value?.toLocaleString ?
            p.value?.toLocaleString('de-ch')
          : null
        let color
        if (!tpop) {
          color = 'grey'
        } else {
          const isUrspruenglich = tpop?.status < 200
          color = isUrspruenglich ? colorUrspruenglich : colorAngesiedelt
        }
        return (
          <Row
            key={p.dataKey}
            color={color}
          >
            <Label>{`${label}:`}</Label>
            <Value>{value}</Value>
          </Row>
        )
      })}
    </Popup>
  )
}
