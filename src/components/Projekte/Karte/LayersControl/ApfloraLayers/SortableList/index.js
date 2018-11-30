import React from 'react'
import { SortableContainer } from 'react-sortable-hoc'

import SortableItem from './SortableItem'

const SortableList = SortableContainer(({ treeName, items, data }) => (
  <div>
    {items.map((apfloraLayer, index) => (
      <SortableItem
        key={index}
        // need to pass index to sortableElement
        index={index}
        apfloraLayer={apfloraLayer}
        treeName={treeName}
      />
    ))}
  </div>
))

export default SortableList
