import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import styled from '@emotion/styled'

import { StoreContext } from '../../../../storeContext.js'
import { useRootNavData } from '../../../../modules/useRootNavData.js'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Bookmark } from '../Bookmark/index.jsx'

export const navData = {
  id: 'projekte',
  url: '/Daten/Projekte',
  label: `Projekte`,
  totalCount: 1,
  menus: [
    {
      id: 'e57f56f4-4376-11e8-ab21-4314b6749d13',
      label: `AP Flora Kt. Zürich`,
    },
  ],
}

export const Menu = memo(() => {
  return (
    <Bookmark
      key={navData.id}
      navData={navData}
    />
  )
})
