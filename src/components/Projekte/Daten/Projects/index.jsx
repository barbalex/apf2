import { memo } from 'react'

import { List } from '../../../shared/List/index.jsx'

const items = [
  {
    id: 'e57f56f4-4376-11e8-ab21-4314b6749d13',
    label: `AP Flora Kt. Zürich`,
  },
]

export const Component = memo(() => (
  <List
    items={items}
    title="Projekte"
    totalCount={1}
  />
))
