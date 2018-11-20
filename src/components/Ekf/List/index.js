// @flow
import React, { useEffect, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'

import initiateDataFromUrl from './initiateDataFromUrl'

const Container = styled.div`
  height: 100%;
  border-right: 1px solid rgb(46, 125, 50);
`
const NoDataContainer = styled.div`
  padding 15px;
`
const OuterContainer = styled.div`
  border-bottom: 1px solid rgba(46, 125, 50, 0.5);
  cursor: pointer;
  background-color: ${props => (props.active ? 'rgb(255, 250, 198)' : 'unset')};
  border-top: ${props =>
    props.active ? '1px solid rgba(46, 125, 50, 0.5)' : 'unset'};
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

const getEkfFromData = data => {
  const ekfAdresseId = get(data, 'ekfAdresseId')
  const ekfNodes = !!ekfAdresseId
    ? get(data, 'adresseById.tpopkontrsByBearbeiter.nodes', [])
    : get(
        data,
        'userByName.adresseByAdresseId.tpopkontrsByBearbeiter.nodes',
        [],
      )
  let ekf = ekfNodes.map(e => ({
    projekt: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.projektByProjId.name',
      '',
    ),
    projId: get(e, 'tpopByTpopId.popByPopId.apByApId.projektByProjId.id'),
    art: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.aeEigenschaftenByArtId.artname',
      '',
    ),
    apId: get(e, 'tpopByTpopId.popByPopId.apByApId.id'),
    pop: `${get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.popByPopId.name',
      '(kein Name)',
    )}`,
    popId: get(e, 'tpopByTpopId.popByPopId.id'),
    popSort: get(e, 'tpopByTpopId.popByPopId.nr', '(keine Nr)'),
    tpop: `${get(e, 'tpopByTpopId.nr', '(keine Nr)')}: ${get(
      e,
      'tpopByTpopId.flurname',
      '(kein Flurname)',
    )}`,
    tpopId: get(e, 'tpopByTpopId.id'),
    tpopSort: get(e, 'tpopByTpopId.nr', '(keine Nr)'),
    id: e.id,
  }))
  return sortBy(ekf, ['projekt', 'art', 'popSort', 'tpopSort'])
}

const EkfList = ({
  data,
  loading,
  dimensions,
  client,
}: {
  data: Object,
  loading: Boolean,
  dimensions: Object,
  client: Object,
}) => {
  const [initialKontrId, setInitialKontrId] = useState(null)
  const ekf = getEkfFromData(data)
  const activeNodeArray = get(data, 'tree.activeNodeArray')
  const activeTpopkontrId = activeNodeArray[9]

  useEffect(
    () => {
      // set initial kontrId so form is shown for first ekf
      // IF none is choosen yet
      if (
        ekf &&
        ekf.length &&
        ekf.length > 0 &&
        !activeTpopkontrId &&
        !initialKontrId
      ) {
        const row = ekf[0]
        const url = [
          'Projekte',
          row.projId,
          'Aktionspläne',
          row.apId,
          'Populationen',
          row.popId,
          'Teil-Populationen',
          row.tpopId,
          'Freiwilligen-Kontrollen',
          row.id,
        ]
        initiateDataFromUrl({ url, client })
        setInitialKontrId(row.id)
      }
    },
    [initialKontrId],
  )

  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  const projektCount = uniq(ekf.map(e => e.projekt)).length
  const itemSize = projektCount > 1 ? 110 : 91
  const innerContainerHeight = projektCount > 1 ? 81 : 62

  if (!loading && ekf.length === 0)
    return (
      <NoDataContainer>
        {`Für das Jahr ${get(
          data,
          'ekfYear',
        )} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
      </NoDataContainer>
    )

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
          const url = [
            'Projekte',
            row.projId,
            'Aktionspläne',
            row.apId,
            'Populationen',
            row.popId,
            'Teil-Populationen',
            row.tpopId,
            'Freiwilligen-Kontrollen',
            row.id,
          ]

          return (
            <OuterContainer
              style={style}
              onClick={() =>
                initiateDataFromUrl({ activeNodeArray: url, client })
              }
              active={activeTpopkontrId === row.id}
            >
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

export default withApollo(EkfList)
