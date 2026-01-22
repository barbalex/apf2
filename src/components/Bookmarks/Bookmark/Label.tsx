import { useLocation } from 'react-router'
import Tooltip from '@mui/material/Tooltip'

import { toggleNodeSymbol } from '../../Projekte/TreeContainer/Tree/toggleNodeSymbol.ts'
import { PrefetchLink } from '../../shared/PrefetchLink.tsx'

import styles from './Label.module.css'

export const Label = ({ navData, outerContainerRef, labelStyle, ref }) => {
  const { pathname, search } = useLocation()

  // issue: relative paths are not working!!!???
  // also: need to decode pathname (Zähleinheiten...)
  const pathnameDecoded = decodeURIComponent(pathname)
  const pathnameWithoutLastSlash = pathnameDecoded.replace(/\/$/, '')
  const linksToSomewhereElse = !pathnameWithoutLastSlash.endsWith(navData.url)

  const onClick = () => {
    // 1. ensure the clicked element is visible
    const element = outerContainerRef.current
    if (!element) return
    // the timeout needs to be rather long to wait for the transition to finish
    setTimeout(() => {
      element.scrollIntoView({
        inline: 'start',
      })
    }, 1000)
    // 2. sync tree openNodes
    toggleNodeSymbol({
      node: {
        url: navData.url
          .split('/')
          .filter((e) => !!e)
          .slice(1),
      },
      search,
    })
  }

  const label =
    linksToSomewhereElse ?
      <PrefetchLink
        to={{ pathname: navData.url, search }}
        onClick={onClick}
        ref={ref}
        style={{ ...labelStyle }}
        className={styles.link}
      >
        {navData.labelShort ?? navData.label}
      </PrefetchLink>
    : <div
        className={styles.text}
        ref={ref}
        style={{ ...labelStyle }}
      >
        {navData.labelShort ?? navData.label}
      </div>

  // tooltip can mess with touch, so hide it on touch devices
  if (!matchMedia('(pointer: coarse)').matches) {
    return <Tooltip title={navData.label}>{label}</Tooltip>
  }

  return label
}
