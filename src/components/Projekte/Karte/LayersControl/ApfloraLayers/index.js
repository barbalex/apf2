import React, { useContext, useCallback } from 'react'
import compose from 'recompose/compose'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { arrayMove } from 'react-sortable-hoc'
import { getSnapshot } from 'mobx-state-tree'

import mobxStoreContext from '../../../../../mobxStoreContext'
import SortableList from './SortableList'

const CardContent = styled.div`
  color: rgb(48, 48, 48);
  padding-left: 5px;
  padding-right: 4px;
`

const enhance = compose(observer)

const ApfloraLayers = ({
  treeName,
  popBounds,
  setPopBounds,
  tpopBounds,
  setTpopBounds,
}: {
  treeName: string,
  popBounds: Array<Array<Number>>,
  setPopBounds: () => void,
  tpopBounds: Array<Array<Number>>,
  setTpopBounds: () => void,
}) => {
  const mobxStore = useContext(mobxStoreContext)
  const { apfloraLayers, setApfloraLayers, activeApfloraLayers } = mobxStore

  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }) =>
      setApfloraLayers(arrayMove(apfloraLayers, oldIndex, newIndex)),
    [apfloraLayers],
  )

  return (
    <CardContent>
      <SortableList
        items={getSnapshot(apfloraLayers)}
        onSortEnd={onSortEnd}
        useDragHandle
        lockAxis="y"
        treeName={treeName}
        activeApfloraLayers={activeApfloraLayers}
      />
    </CardContent>
  )
}

export default enhance(ApfloraLayers)
