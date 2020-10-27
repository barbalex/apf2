import React, { useContext, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import Item from './Item'
import storeContext from '../../../../storeContext'
import initiateDataFromUrl from '../initiateDataFromUrl'

const Container = styled.div`
  height: 100%;
  border-right: 1px solid rgb(46, 125, 50);
`
const NoDataContainer = styled.div`
  padding 15px;
`

const getEkfFromData = ({ data, ekfAdresseId }) => {
  const ekfNodes = !!ekfAdresseId
    ? get(data, 'adresseById.tpopkontrsByBearbeiter.nodes', [])
    : get(
        data,
        'userByName.adresseByAdresseId.tpopkontrsByBearbeiter.nodes',
        [],
      )
  const ekf = ekfNodes.map((e) => ({
    projekt: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.projektByProjId.name',
      '',
    ),
    projId: get(e, 'tpopByTpopId.popByPopId.apByApId.projektByProjId.id'),
    art: get(
      e,
      'tpopByTpopId.popByPopId.apByApId.aeTaxonomyByArtId.artname',
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

const EkfList = ({ data, loading, height }) => {
  const store = useContext(storeContext)
  const { ekfYear, ekfAdresseId, tree, setEkfIds } = store
  const ekf = getEkfFromData({ data, ekfAdresseId })
  setEkfIds(ekf.map((e) => e.id))

  const { activeNodeArray, treeWidth } = tree
  const activeTpopkontrId =
    activeNodeArray.length > 9
      ? activeNodeArray[9]
      : '99999999-9999-9999-9999-999999999999'

  const projektCount = uniq(ekf.map((e) => e.projekt)).length
  const itemSize = projektCount > 1 ? 110 : 91

  useEffect(() => {
    // set initial kontrId so form is shown for first ekf
    // IF none is choosen yet
    if (ekf.length > 0 && !activeTpopkontrId) {
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
      initiateDataFromUrl({
        activeNodeArray: url,
        store,
      })
    }
  }, [ekfYear, ekf.length, ekf, activeTpopkontrId, store])

  if (!loading && ekf.length === 0) {
    return (
      <NoDataContainer>
        {`Für das Jahr ${ekfYear} existieren offenbar keine Erfolgskontrollen mit Ihnen als BearbeiterIn`}
      </NoDataContainer>
    )
  }

  console.log('List', {
    height,
    itemCount: ekf.length,
    itemSize,
    itemsHeight: ekf.length * itemSize,
    windowHeight: window.innerHeight,
  })

  return (
    <Container>
      <List
        height={height}
        itemCount={ekf.length}
        itemSize={itemSize}
        width={treeWidth}
      >
        {({ index, style }) => (
          <Item
            activeTpopkontrId={activeTpopkontrId}
            projektCount={projektCount}
            style={style}
            row={ekf[index]}
          />
        )}
      </List>
    </Container>
  )
}

export default observer(EkfList)
