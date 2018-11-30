import React from 'react'
import { observer } from 'mobx-react-lite'
import { SortableContainer } from 'react-sortable-hoc'
import 'leaflet'
import 'leaflet-draw'

import SortableItem from './SortableItem'

const SortableList = SortableContainer(({ treeName, items, data, client }) => (
  <div>
    {items.map((apfloraLayer, index) => (
      <SortableItem
        key={index}
        apfloraLayer={apfloraLayer}
        data={data}
        treeName={treeName}
        client={client}
      />
    ))}
  </div>
))

export default SortableList
