import React from 'react'
import styled from 'styled-components'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

import ErrorBoundary from '../../shared/ErrorBoundary'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  break-before: page;
  font-size: 12px;
  line-height: 1.1em;
  @media screen {
    margin-top: 1cm;
  }
  @media print {
    /*padding-top: 0.3cm !important;*/
    margin-top: 0.3cm !important;
  }
`
const AvRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
  break-inside: avoid;
`
const NonAvRow = styled.div`
  display: flex;
  padding: 0.05cm 0;
`
const Av = styled.div`
  min-width: 5cm;
  max-width: 5cm;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const Art = styled.div``
const Title = styled.p`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
`

const AvList = ({ data }) => {
  const nodes = data?.jberAbc?.nodes ?? []
  const avGrouped = groupBy(
    nodes.map((ap) => ({
      av: ap?.bearbeiter ?? '(kein Wert)',
      art: ap?.artname ?? '(keine Art gewählt)',
    })),
    'av',
  )
  const avs = Object.keys(avGrouped).sort()

  return (
    <ErrorBoundary>
      <Container>
        <Title>Artverantwortliche</Title>
        {avs.map((av) => {
          const array = sortBy(avGrouped[av], 'art')
          return array.map((o, i) => {
            if (i === 0)
              return (
                <AvRow key={o.art}>
                  <Av>{o.av}</Av>
                  <Art>{o.art}</Art>
                </AvRow>
              )
            return (
              <NonAvRow key={o.art}>
                <Av>{}</Av>
                <Art>{o.art}</Art>
              </NonAvRow>
            )
          })
        })}
      </Container>
    </ErrorBoundary>
  )
}

export default AvList
