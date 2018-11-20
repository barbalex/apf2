// @flow
import React, { useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { withApollo } from 'react-apollo'

import initiateDataFromUrl from './initiateDataFromUrl'
import Item from './Item'

const Container = styled.div`
  height: 100%;
  border-right: 1px solid rgb(46, 125, 50);
`
const NoDataContainer = styled.div`
  padding 15px;
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
  const ekf = getEkfFromData(data)

  if (!loading && ekf.length === 0) {
    return (
      <NoDataContainer>
        {`Für das Jahr ${get(
          data,
          'ekfYear',
        )} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
      </NoDataContainer>
    )
  }

  const activeNodeArray = get(data, 'tree.activeNodeArray')
  const activeTpopkontrId = activeNodeArray[9]

  useEffect(
    () => {
      // set initial kontrId so form is shown for first ekf
      // IF none is choosen yet
      if (ekf && ekf.length && ekf.length > 0 && !activeTpopkontrId) {
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
        initiateDataFromUrl({ activeNodeArray: url, client })
      }
    },
    [loading],
  )

  const height = isNaN(dimensions.height) ? 250 : dimensions.height
  const width = isNaN(dimensions.width) ? 250 : dimensions.width - 1
  const projektCount = uniq(ekf.map(e => e.projekt)).length
  const itemSize = projektCount > 1 ? 110 : 91

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
            <Item
              activeTpopkontrId={activeTpopkontrId}
              projektCount={projektCount}
              style={style}
              row={row}
            />
          )
        }}
      </List>
    </Container>
  )
}

export default withApollo(EkfList)
