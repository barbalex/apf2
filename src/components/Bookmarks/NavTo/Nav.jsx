import { Link, useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'

import { link } from './Nav.module.css'

export const Nav = ({ item, baseUrl, needsBorderRight = false }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

  return (
    <Tooltip title={item.label}>
      <Link
        to={{
          pathname: `${baseUrl ?? pathnameWithoutLastSlash}/${item.id}`,
          search,
        }}
        style={{
          borderRight:
            needsBorderRight ? 'rgba(46, 125, 50, 0.5) solid 1px' : 'none',
        }}
        className={link}
      >
        {item.label}
      </Link>
    </Tooltip>
  )
}
