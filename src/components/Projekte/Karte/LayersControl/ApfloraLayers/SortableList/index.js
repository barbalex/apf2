import React, { useContext, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { SortableContainer } from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'

import mobxStoreContext from '../../../../../../mobxStoreContext'
import SortableItem from './SortableItem'

const SortableList = SortableContainer(
  ({
    tree,
    items,
    activeApfloraLayers,
    setActiveApfloraLayers,
    data,
    bounds,
    setBounds,
    mapFilter,
    mapIdsFiltered,
    mapPopIdsFiltered,
    mapTpopIdsFiltered,
    mapBeobNichtBeurteiltIdsFiltered,
    mapBeobZugeordnetIdsFiltered,
    mapBeobNichtZuzuordnenIdsFiltered,
    client,
    setAssigningBeob,
  }) => (
    <div>
      {items.map((apfloraLayer, index) => (
        <SortableItem
          key={index}
          index={index}
          apfloraLayer={apfloraLayer}
          activeApfloraLayers={activeApfloraLayers}
          setActiveApfloraLayers={setActiveApfloraLayers}
          data={data}
          tree={tree}
          bounds={bounds}
          setBounds={setBounds}
          mapFilter={mapFilter}
          mapIdsFiltered={mapIdsFiltered}
          mapPopIdsFiltered={mapPopIdsFiltered}
          mapTpopIdsFiltered={mapTpopIdsFiltered}
          mapBeobNichtBeurteiltIdsFiltered={mapBeobNichtBeurteiltIdsFiltered}
          mapBeobNichtZuzuordnenIdsFiltered={mapBeobNichtZuzuordnenIdsFiltered}
          mapBeobZugeordnetIdsFiltered={mapBeobZugeordnetIdsFiltered}
          client={client}
          setAssigningBeob={setAssigningBeob}
        />
      ))}
    </div>
  ),
)

export default SortableList
