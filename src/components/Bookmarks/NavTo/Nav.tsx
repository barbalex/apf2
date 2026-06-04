import { useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'

import { PrefetchLink } from '../../shared/PrefetchLink.tsx'

import styles from './Nav.module.css'

export const Nav = ({ item, baseUrl, needsBorderRight = false }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

  return (
    <Tooltip title={item.label}>
      <PrefetchLink
        to={{
          pathname: `${baseUrl ?? pathnameWithoutLastSlash}/${item.id}`,
          search,
        }}
        style={{
          borderRight:
            needsBorderRight ? 'rgba(46, 125, 50, 0.5) solid 1px' : 'none',
        }}
        className={styles.link}
      >
        {item.label}
      </PrefetchLink>
    </Tooltip>
  )
}
