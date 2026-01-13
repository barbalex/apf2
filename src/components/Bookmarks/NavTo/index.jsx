import { useMatches, useLocation } from 'react-router'

import styles from './index.module.css'

export const NavTo = () => {
  const { pathname } = useLocation()
  const allMatches = useMatches()
  // get match that contains the current pathname minus the last slash - if it ends with a slash
  // Hm. So many matches. Often multiple with same path. Hard to find the right one.
  // TODO: ensure this works for all cases
  const navMatches = allMatches.filter(
    (m) =>
      (m.pathname === pathname || `${m.pathname}/` === pathname) &&
      m.handle?.nav,
  )
  const navMatch = navMatches?.[0]
  const Nav = navMatch?.handle?.nav

  return (
    <div className={styles.container}>
      {!!Nav ?
        <Nav />
      : null}
    </div>
  )
}
