import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'
import styled from '@emotion/styled'

import { StoreContext } from '../../../storeContext.js'
import { useRootNavData } from '../../../modules/useRootNavData.js'
import { Spinner } from '../../shared/Spinner.jsx'
import { Error } from '../../shared/Error.jsx'

const StyledTooltip = styled(Tooltip)``

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0 9px;
  min-width: 50px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-right: ${(props) =>
    props.borderRight === 'true' ? 'rgba(46, 125, 50, 0.5) solid 1px' : 'none'};
  &:hover {
    text-decoration: underline;
    text-decoration-color: rgba(55, 118, 28, 0.5);
  }
`
const Border = styled.div`
  width: 1px;
  height: 1em;
  background-color: red;
  margin-left: -6px;
`

export const Nav = memo(
  observer(({ item, needsBorderRight = false }) => {
    const { pathname, search } = useLocation()

    // issue: relative paths are not working!!!???
    const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

    return (
      <>
        <Tooltip title={item.label}>
          <StyledLink
            key={item.id}
            to={{ pathname: `${pathnameWithoutLastSlash}/${item.id}`, search }}
            borderRight={needsBorderRight.toString()}
          >
            {item.label}
          </StyledLink>
        </Tooltip>
      </>
    )
  }),
)
