import React, { useContext, useCallback } from 'react'
import compose from 'recompose/compose'
import withProps from 'recompose/withProps'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { arrayMove } from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'
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
}: {
  treeName: string,
  popBounds: Array<Array<Number>>,
  setPopBounds: () => void,
  tpopBounds: Array<Array<Number>>,
  setTpopBounds: () => void,
  data: Object,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers, setApfloraLayers } = mobxStore

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
      />
    </CardContent>
  )
}

export default enhance(ApfloraLayers)
