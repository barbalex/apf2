import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useLocation } from 'react-router'

import { StoreContext } from '../../../storeContext.js'
import { useRootNavData } from '../../../modules/useRootNavData.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'

export const Nav = memo(
  observer(({ item }) => {
    const { pathname, search } = useLocation()

    // issue: relative paths are not working!!!???
    const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

    return (
      <Link
        key={item.id}
        to={{ pathname: `${pathnameWithoutLastSlash}/${item.id}`, search }}
      >
        {item.label}
      </Link>
    )
  }),
)
