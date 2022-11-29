import React, { useContext, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import uniq from 'lodash/uniq'
import sortBy from 'lodash/sortBy'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import SimpleBar from 'simplebar-react'

import Item from './Item'
import storeContext from '../../../../storeContext'
import initiateDataFromUrl from '../initiateDataFromUrl'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgb(46, 125, 50);
`
const Scrollcontainer = styled.div`
  overflow-y: auto;
`
const NoDataContainer = styled.div`
  padding 15px;
`

const getEkfFromData = ({ data, ekfAdresseId }) => {
  const ekfNodes = ekfAdresseId
    ? data?.adresseById?.tpopkontrsByBearbeiter?.nodes ?? []
    : data?.userByName?.adresseByAdresseId?.tpopkontrsByBearbeiter?.nodes ?? []
  const ekf = ekfNodes.map((e) => ({
    projekt: e?.tpopByTpopId?.popByPopId?.apByApId?.projektByProjId?.name ?? '',
    projId: e?.tpopByTpopId?.popByPopId?.apByApId?.projektByProjId?.id,
    art:
      e?.tpopByTpopId?.popByPopId?.apByApId?.aeTaxonomyByArtId?.artname ?? '',
    apId: e?.tpopByTpopId?.popByPopId?.apByApId?.id,
    pop: `${e?.tpopByTpopId?.popByPopId?.nr ?? '(keine Nr)'}: ${
      e?.tpopByTpopId?.popByPopId?.name ?? '(kein Name)'
    }`,
    popId: e?.tpopByTpopId?.popByPopId?.id,
    popSort: e?.tpopByTpopId?.popByPopId?.nr ?? '(keine Nr)',
    tpop: `${e?.tpopByTpopId?.nr ?? '(keine Nr)'}: ${
      e?.tpopByTpopId?.flurname ?? '(kein Flurname)'
    }`,
    tpopId: e?.tpopByTpopId?.id,
    tpopSort: e?.tpopByTpopId?.nr ?? '(keine Nr)',
    id: e.id,
  }))
  return sortBy(ekf, ['projekt', 'art', 'popSort', 'tpopSort'])
}

const EkfList = ({ data, loading }) => {
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
  const itemHeight = projektCount > 1 ? 110 : 91

  useEffect(() => {
    // set initial kontrId so form is shown for first ekf
    // IF none is choosen yet
    if (ekf.length > 0 && !activeTpopkontrId) {
      const row = ekf[0]
      const url = [
        'Projekte',
        row.projId,
        'Arten',
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

  return (
    <Container>
      <Scrollcontainer>
        <SimpleBar
          style={{
            maxHeight: '100%',
            height: '100%',
          }}
        >
          <List
            height={ekf.length * itemHeight}
            itemCount={ekf.length}
            itemSize={itemHeight}
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
        </SimpleBar>
      </Scrollcontainer>
    </Container>
  )
}

export default observer(EkfList)
