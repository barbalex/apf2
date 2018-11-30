import React, { useContext, useCallback } from 'react'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { arrayMove } from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'
import { withApollo } from 'react-apollo'
import { getSnapshot } from 'mobx-state-tree'

import withData from './withData'
import mobxStoreContext from '../../../../../mobxStoreContext'
import SortableList from './SortableList'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
`

const enhance = compose(
  withApollo,
  withProps(({ treeName }) => {
    const mobxStore = useContext(mobxStoreContext)
    return {
      activeNodes: mobxStore[`${treeName}ActiveNodes`],
    }
  }),
  withData,
  observer,
)

const ApfloraLayers = ({
  treeName,
  popBounds,
  setPopBounds,
  tpopBounds,
  setTpopBounds,
  data,
  client,
}: {
  treeName: string,
  popBounds: Array<Array<Number>>,
  setPopBounds: () => void,
  tpopBounds: Array<Array<Number>>,
  setTpopBounds: () => void,
  data: Object,
  client: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const {
    apfloraLayers,
    setApfloraLayers,
    activeApfloraLayers,
    setActiveApfloraLayers,
    bounds,
    setBounds,
    mapFilter,
    setAssigningBeob,
  } = mobxStore
  const tree = mobxStore[treeName]
  const {
    idsFiltered: mapIdsFiltered,
    popIdsFiltered: mapPopIdsFiltered,
    tpopIdsFiltered: mapTpopIdsFiltered,
    beobNichtBeurteiltIdsFiltered: mapBeobNichtBeurteiltIdsFiltered,
    beobNichtZuzuordnenIdsFiltered: mapBeobNichtZuzuordnenIdsFiltered,
    beobZugeordnetIdsFiltered: mapBeobZugeordnetIdsFiltered,
  } = mobxStore[treeName].map

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) =>
      setApfloraLayers(arrayMove(apfloraLayers, oldIndex, newIndex)),
    [apfloraLayers],
  )

  if (data.error) return `Fehler: ${data.error.message}`
  return (
    <CardContent>
      <SortableList
        items={getSnapshot(apfloraLayers)}
        onSortEnd={onSortEnd}
        useDragHandle
        lockAxis="y"
        data={data}
        treeName={treeName}
        client={client}
      />
    </CardContent>
  )
}

export default enhance(ApfloraLayers)
