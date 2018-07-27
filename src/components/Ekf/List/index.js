// @flow
import React from 'react'
import { FixedSizeList as List } from 'react-window'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'

const Container = styled.div`
  height: 100%;
  border-right: 1px solid rgb(46, 125, 50);
`
const OuterContainer = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  &:hover {
    background-color: rgb(255, 250, 198);
    border-top: 1px solid rgba(46, 125, 50, 0.5);
    margin-top: -1px;
  }
`
const InnerContainer = styled.div`
  height: ${props => props.height}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  > div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const EkfList = ({
  data,
  dimensions,
}: {
  data: Object,
  dimensions: Object,
}) => {
  let ekf = get(
    data,
    'userByName.adresseByAdresseId.tpopkontrsByBearbeiter.nodes',
    []
  ).map(e => ({
    projekt: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.projektByProjId.name',
      ''
    ),
    art: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
      ''
    ),
    pop: `${get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.popByPopId.name',
      '(kein Name)'
    )}`,
    popSort: get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)'),
    tpop: `${get(e, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.flurname',
      '(kein Flurname)'
    )}`,
    tpopSort: get(e, 'tpopByTpopId.nr', '(keine Nr)'),
  }))
  ekf = sortBy(ekf, ['projekt', 'art', 'popSort', 'tpopSort'])
  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  const projektCount = uniq(ekf.map(e => e.projekt)).length
  const itemSize = projektCount > 1 ? 110 : 91
  const innerContainerHeight = projektCount > 1 ? 81 : 62

  return (
    <Container>
      <List
        height={height}
        itemCount={ekf.length}
        itemSize={itemSize}
        width={width}
      >
        {({ index, style }) => {
          const row = ekf[index]

          return (
            <OuterContainer style={style}>
              <InnerContainer height={innerContainerHeight}>
                {projektCount > 1 && <div>{row.projekt}</div>}
                <div>{row.art}</div>
                <div>{row.pop}</div>
                <div>{row.tpop}</div>
              </InnerContainer>
            </OuterContainer>
          )
        }}
      </List>
    </Container>
  )
}

export default EkfList
