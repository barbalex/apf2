import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../storeContext.js'

export const LabelFilter = memo(
  observer(({ nodeLabelName }) => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree
    const filter = nodeLabelFilter?.[nodeLabelName]
    console.log('LabelFilter', { nodeLabelName, filter })

    return null
  }),
)
