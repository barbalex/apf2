import { memo, useCallback, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import MenuItem from '@mui/material/MenuItem'
import { Link, useLocation, useNavigate } from 'react-router'
import styled from '@emotion/styled'

import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.js'
import { StoreContext } from '../../../../storeContext.js'

const StyledLink = styled(Link)`
  text-decoration: none;
`

export const Item = memo(
  observer(({ menu, baseUrl, onClose }) => {
    const { pathname, search } = useLocation()
    const navigate = useNavigate()

    const store = useContext(StoreContext)
    const activeNodeArray = store.tree.activeNodeArray

    // issue: relative paths are not working!!!???
    const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

    const selected = useMemo(
      () =>
        menuIsInActiveNodePath({
          menuUrl: `${baseUrl}/${menu.id}`
            .split('/')
            .filter((p) => !!p)
            .filter((p) => p !== 'Daten'),
          activeNodeArray,
        }),
      [activeNodeArray, baseUrl, menu.id],
    )
    const to = useMemo(
      () => ({
        pathname: `${baseUrl ?? pathnameWithoutLastSlash}/${menu.id}`,
        search,
      }),
      [baseUrl, pathnameWithoutLastSlash, menu.id, search],
    )

    return (
      <MenuItem selected={selected}>
        <StyledLink
          to={to}
          onClick={onClose}
        >
          {menu.label}
        </StyledLink>
      </MenuItem>
    )
  }),
)
