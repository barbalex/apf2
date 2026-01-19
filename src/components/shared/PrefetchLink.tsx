import { useContext } from 'react'
import { Link, type LinkProps } from 'react-router'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../mobxContext.ts'
import { prefetchRouteData } from '../../modules/prefetchRouteData.ts'

/**
 * A Link component that prefetches route data on hover
 * This improves perceived performance by loading data before the user clicks
 */
export const PrefetchLink = observer(
  ({ to, onMouseEnter, ...props }: LinkProps) => {
    const store = useContext(MobxContext)

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call any existing onMouseEnter handler
      onMouseEnter?.(e)

      // Prefetch the route data
      const path =
        typeof to === 'string' ? to
        : typeof to === 'object' && 'pathname' in to ? to.pathname
        : null

      if (path) {
        prefetchRouteData({ path, store })
      }
    }

    return (
      <Link
        to={to}
        onMouseEnter={handleMouseEnter}
        {...props}
      />
    )
  },
)
