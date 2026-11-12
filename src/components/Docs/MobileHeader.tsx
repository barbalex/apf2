import { Link, useLocation } from 'react-router'
import { IconButton } from '@mui/material'
import { FaChevronLeft } from 'react-icons/fa6'

import styles from './MobileHeader.module.css'

// shown on narrow screens only (see MobileHeader.module.css):
// leads back from a doc page to the documentation menu list
export const MobileHeader = () => {
  const { search } = useLocation()

  return (
    <div className={styles.header}>
      <IconButton
        component={Link}
        to={`/Dokumentation/${search}`}
        aria-label="zur Listenansicht"
        size="small"
        sx={{ color: 'white' }}
      >
        <FaChevronLeft />
      </IconButton>
      <Link to={`/Dokumentation/${search}`} className={styles.title}>
        Dokumentation
      </Link>
    </div>
  )
}
