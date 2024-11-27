import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useLocation } from 'react-router'
import styled from '@emotion/styled'

import { StoreContext } from '../../../storeContext.js'
import { useRootNavData } from '../../../modules/useRootNavData.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0 7px 0 9px;
  &:hover {
    text-decoration: underline;
    text-decoration-color: rgba(55, 118, 28, 0.5);
  }
  &:not(:last-of-type):after {
    content: '';
    display: inline-block;
    width: 1px;
    height: 1em;
    background-color: rgba(55, 118, 28, 0.5);
    transform: translate(8.5px, 2px);
  }
`

export const Nav = memo(
  observer(({ item }) => {
    const { pathname, search } = useLocation()

    // issue: relative paths are not working!!!???
    const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

    return (
      <StyledLink
        key={item.id}
        to={{ pathname: `${pathnameWithoutLastSlash}/${item.id}`, search }}
      >
        {item.label}
      </StyledLink>
    )
  }),
)
